import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import CoCreateCursors from '@cocreate/cursors';
import crud from '@cocreate/crud-client';


class CoCreateCRDTClass {
	
	constructor(org, ydoc) {
		this.org = config.organization_Id;
		this.doc = ydoc;
		this.docs = {};
	}


	/*
	crdt.init({
		collection: "module",
		document_id: "",
		name: "",
		metadata: "xxxx"
	})
	*/
	init(info) {
		try {
			this.createDoc(info)
		} catch(e) {
			console.log('Invalid param', e);
		}
	}
	
	
	createDoc(info) {

		let docName = this.generateDocName(info);
		let typeName = this.generateTypeName(info);

		if (this.docs[docName]) { 
			if (!this.docs[docName].types.some((type) => type === typeName)) {
				this.docs[docName].types.push(typeName);
				this._registerUpdateEvent(this.docs[docName], typeName);
			}
			return false;
		} 
		
		const crdtDoc = this.doc;
		const url_socket = this.__getSocketUrl();
		const shardType = crdtDoc.getText(typeName);

		var socketProvider = new WebsocketProvider(url_socket, docName, crdtDoc);
		
		// const indexeddbProvider = new IndexeddbPersistence(docName, crdtDoc);
		// indexeddbProvider.on('synced', () => {});

		const awareness = socketProvider.awareness;

		this._cursors = new Map();
		
		this._awarenessListener = event => {
		 const f = clientId => {
			  this.updateSelection(crdtDoc, typeName, shardType, this._cursors, clientId, awareness);
		  };
		  event.added.forEach(f);
		  event.removed.forEach(f);
		  event.updated.forEach(f);
		};
		
		awareness.on('update', this._awarenessListener);

        this.docs[docName] = {
			id: docName,
			doc: crdtDoc,
			socket: socketProvider,
			awareness: awareness,
			types: [typeName],
			// indexeddb: indexeddbProvider
		};
		this._registerUpdateEvent(this.docs[docName], typeName);

		return true;
	}
	
	__getSocketUrl() {
		let w_location = window.location || window.parent.location;
		let w_protocol = w_location.protocol;
		let w_host = w_location.host;
		if (w_location.protocol === "about:") {
			w_protocol = w_location.protocol;
			w_host = document.referrer;
		}
		let protocol = w_protocol === 'http:' ? 'ws' : 'wss';

		let url_socket = `${protocol}://${w_host}:8080/`;
		if (window.config && window.config.host) {
			if (window.config.host.includes("://")) {
				url_socket = `${window.config.host}/`;
			} else {
				url_socket = `${protocol}://${window.config.host}/`;
			}
		}
		
		url_socket += "crdt/";
		
		return url_socket;
	}
	
	_registerUpdateEvent(docName, typeName) {
		const crdtDoc = docName.doc;
		const shardType = crdtDoc.getText(typeName);
		let self = this;
		
		shardType.observe((event) => {
			self._crdtUpdateEvent(event, typeName);
		});
	}

	_crdtUpdateEvent(event, typeName) {
		const eventDelta = event.delta;
		if (eventDelta.length == 0)	return;
		
		const info = JSON.parse(atob(typeName));
		// let is_save_value = false
		
		const update_event = new CustomEvent('cocreate-crdt-update', {
			detail: {eventDelta,...info}, 
		});
		
		window.dispatchEvent(update_event);
	}
	
	sendPosition(info) {
		let docName = this.generateDocName(info);
		let typeName = this.generateTypeName(info);
		let type = this.docs[docName].doc.getText(typeName);
		if (!type) return;
		if (info.start != null && info.end != null){
			var anchor = Y.createRelativePositionFromTypeIndex(type, info.start);
			var head = Y.createRelativePositionFromTypeIndex(type, info.end);
			
			this.docs[docName].socket.awareness.setLocalStateField('cursor', {anchor, head});
		}
		else {
			this.docs[docName].socket.awareness.setLocalStateField('cursor', null);
		}
			
	}
	
	updateSelection (y, cm, type, cursors, clientId, awareness)  {

		if(clientId !== this.doc.clientID){
			
			const m = cursors.get(clientId);
				if (m !== undefined) {
					m.caret.clear();
				if (m.sel !== null) {
				  m.sel.clear();
				}
				cursors.delete(clientId);
			}
			  
			const aw = awareness.getStates().get(clientId);
	
			if (aw === undefined) {
				CoCreateCursors.removeCursor(clientId);
				return;
			}
			const user = aw.user || {};
			if (user.color == null) {
				user.color = '#ffa500';
			}
			if (user.name == null) {
				user.name = `User: ${clientId}`;
			}
			const cursor = aw.cursor;
			if (cursor == null || cursor.anchor == null || cursor.head == null) {
				CoCreateCursors.removeCursor(clientId);
				return;
			}
			// const start = cursor.anchor.item.clock;
			// const end = cursor.head.item.clock;

			const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.anchor), y);
			const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.head), y);
			if (anchor !== null && head !== null ) {
				let info = this.parseName(cursor.anchor['tname']);
				
				let selection = {
					collection: info.collection,
					document_id: info.document_id,
					name: info.name,
					start: anchor.index,
					end: head.index,
					clientId: clientId,
					user:{
						'color':user.color,
						'name':user.name
					},
				};
				CoCreateCursors.drawCursors(selection);
			}
		}
	}
	
	deleteDoc(docName) {
		if (this.docs[docName]) {
			delete this.docs[docName];
		}
	}
	
	destroyObserver(docName, typeName) {
		this.docs[docName].doc.getText(typeName).unobserve((event) => {});
		this.docs[docName].socket.awareness.off('change', this._awarenessListener);
	}
	
	parseName(id) {
		let data = JSON.parse(atob(id));
		let name = {org: data.org, collection: data.collection, document_id: data.document_id};
		return {
			id: btoa(JSON.stringify(name)),
			collection: data.collection,
			document_id: data.document_id,
			name: data.name
		};
	}
	
	generateDocName(info) {
		let docName = {org: config.organization_Id, collection: info.collection, document_id: info.document_id}
		return btoa(JSON.stringify(docName));        
	}
	
	generateTypeName(info) {
		let nameId = {org: config.organization_Id, collection: info.collection, document_id: info.document_id, name: info.name}
		return btoa(JSON.stringify(nameId));        
	}

	/*
	crdt.replaceText({
		collection: "module",
		document_id: "",
		name: "",
		value: "",
		updateCrud: true | false,
		element: dom_object,
		metadata: "xxxx"
	})
	*/
	replaceText(info){
		let docName = this.generateDocName(info);
		let typeName = this.generateTypeName(info);
		if (!this.docs[docName]){
			this.init(info)
		};
		if (info.updateCrud != false) info.updateCrud = true;
		
		if (docName) {
			let oldData = this.docs[docName].doc.getText(typeName).toString();
			let textValue = info['value'].toString();
			if (oldData && oldData.length > 0) {
				this.deleteText({collection: info['collection'], document_id: info['document_id'], name: info['name'], position: 0, length: Math.max(oldData.length, textValue.length), crud: info['crud']});
			}
			this.insertText({ collection: info.collection, document_id: info.document_id, name: info.name, position: 0, value: textValue });
		}
		if (info.crud != false) {
			crud.updateDocument({
				collection: info.collection,
				document_id: info.document_id,
				data: {[info.name]: info.value},
				element: info.element,
				metadata:info.metadata,
				namespace: info.namespace,
				room: info.room,
				broadcast: info.broadcast,
				upsert: info.upsert,
				broadcast_sender: info.broadcast_sender
			})
		}
	}
	
	/*
	crdt.insertText({
		collection: 'module_activities',
		document_id: '5e4802ce3ed96d38e71fc7e5',
		name: 'name',
		value: 'T',
		position: '8',
		attributes: {bold: true}
	})
	*/
	insertText(info) {
		try {
			let docName = this.generateDocName(info)
			let typeName = this.generateTypeName(info)
			
			if (docName) {
				this.docs[docName].doc.getText(typeName).insert(info['position'], info['value'], info['attribute']);
				let wholestring = this.docs[docName].doc.getText(typeName).toString();
				
				if (info.crud != false) {
					crud.updateDocument({
						collection: info.collection,
						document_id: info.document_id,
						data: {
							[info.name]: wholestring
						},
						metadata: 'yjs-change'
					})
				}
			}
		}
		catch (e) {
			console.error(e); 
		}
	}
	
	/*
	crdt.deleteText({
		collection: 'module_activities',
		document_id: '5e4802ce3ed96d38e71fc7e5',
		name: 'name',
		position: '8',
		length: 2,
	})
	*/
	deleteText(info) {
		try{
			let docName = this.generateDocName(info)
			let typeName = this.generateTypeName(info)
			if (docName) {
				this.docs[docName].doc.getText(typeName).delete(info['position'], info['length']);
				let wholestring = this.docs[docName].doc.getText(typeName).toString();
				
				if (info.crud != false) {
					crud.updateDocument({
						collection: info.collection,
						document_id: info.document_id,
						data: {
							[info.name]: wholestring
						},
						metadata: 'yjs-change'
					})
				}
			}
		}
		catch (e) {
			console.error(e); 
		}
	}
	
	
	/*
	crdt.getText({
		collection: 'module_activities',
		document_id: '5e4802ce3ed96d38e71fc7e5',
		name: 'name'
	})
	*/
	getText(info) {
		try{
			let docName = this.generateDocName(info)
			let typeName = this.generateTypeName(info)
			if (docName) {
				return this.docs[docName].doc.getText(typeName).toString();
			} 
			else return "--";
		}
		catch (e) {
			console.error(e); 
			return "";
		}
	}
	
	/*
	crdt.getText({
		collection: 'module_activities',
		document_id: '5e4802ce3ed96d38e71fc7e5',
		name: 'name'
	})
	*/
	getText(info) {
		try{
			let docName = this.generateDocName(info)
			let typeName = this.generateTypeName(info)
			if (docName) {
				return this.docs[docName].doc.getText(typeName).toString();
			} 
			else return "--";
		}
		catch (e) {
			console.error(e); 
			return "";
		}
	}

	/*
	crdt.getDoc({
		collection: 'module_activities',
		document_id: '5e4802ce3ed96d38e71fc7e5',
		name: 'name'
	})
	*/
	getDoc(info) {
		try{
			let docName = this.generateDocName(info)
			let typeName = this.generateTypeName(info)
			if (docName) {
				return this.docs[docName].doc.getText(typeName);
			} 
			else return false;
		}
		catch (e) {
			console.error(e); 
			return false;
		}
	}

	/* 
	crdt.getPosition(function(data))
	crdt.getPosition(function(data){console.log(" EScuchando ahora  ",data)})
	*/
	getPosition(callback){
	if(typeof miFuncion === 'function')
		this.changeListenAwereness(callback);
	else
		console.error('Callback should be a function')
	}
}

window.Y = Y;
const cDoc = new Y.Doc();
let org = config.organization_Id;
let	CoCreateCrdt = new CoCreateCRDTClass(org, cDoc);

export default CoCreateCrdt;