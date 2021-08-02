import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as awarenessProtocol from 'y-protocols/awareness.js';
import CoCreateCursors from '@cocreate/cursors';

class CoCreateCrdtInit {
	constructor(org, ydoc) {
		this.doc = ydoc;
		this.docs = {};
	}
	
	createDoc(info) {

		let docName = this.generateDocName(info)
		let typeName = this.generateTypeName(info)

		if (this.docs[docName]) { 
			if (!this.docs[docName].types.some((type) => type === typeName)) {
				this.docs[docName].types.push(typeName);
				this._registerUpdateEvent(this.docs[docName], typeName)
			}
			return false;
		} 
		
		const crdtDoc = this.doc
		const url_socket = this.__getSocketUrl();
		const shardType = crdtDoc.getText(typeName)

		var socketProvider = new WebsocketProvider(url_socket, docName, crdtDoc);
		
		const indexeddbProvider = new IndexeddbPersistence(docName, crdtDoc)
		indexeddbProvider.on('synced', () => {});

		const awareness = socketProvider.awareness;

		this._cursors = new Map();
		
		this._awarenessListener = event => {
		 const f = clientId => {
			  this.updateSelection(crdtDoc, typeName, shardType, this._cursors, clientId, awareness)
		  }
		  event.added.forEach(f)
		  event.removed.forEach(f)
		  event.updated.forEach(f)
		}
		
		awareness.on('update', this._awarenessListener);

        this.docs[docName] = {
			id: docName,
			doc: crdtDoc,
			socket: socketProvider,
			awareness: awareness,
			types: [typeName],
			indexeddb: indexeddbProvider
		}
		this._registerUpdateEvent(this.docs[docName], typeName)

		return true;
	}
	
	__getSocketUrl() {
		console.log("get_socket url")
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
		const shardType = crdtDoc.getText(typeName)
		let self = this;
		
		shardType.observe((event) => {
			self._crdtUpdateEvent(event, typeName);
		})
	}

	_crdtUpdateEvent(event, typeName) {
		const eventDelta = event.delta;
		if (eventDelta.length == 0)	return;
		
		const info = JSON.parse(atob(typeName));
		// let is_save_value = false
		
		const update_event = new CustomEvent('cocreate-crdt-update', {
			detail: {eventDelta,...info}, 
		})
		
		window.dispatchEvent(update_event);
	}
	
	sendPosition(info) {
		let docName = this.generateDocName(info);
		let typeName = this.generateTypeName(info);
		let type = this.docs[docName].doc.getText(typeName);
		if (!type) return;
		if (info.start != null && info.end != null){
			var anchor = Y.createRelativePositionFromTypeIndex(type, info.start)
			var head = Y.createRelativePositionFromTypeIndex(type, info.end)
			
			this.docs[docName].socket.awareness.setLocalStateField('cursor', {anchor, head})
		}
		else {
			this.docs[docName].socket.awareness.setLocalStateField('cursor', null);
		}
			
	}
	
	updateSelection (y, cm, type, cursors, clientId, awareness)  {

		if(clientId !== this.doc.clientID){
			
			const m = cursors.get(clientId)
				if (m !== undefined) {
					m.caret.clear()
				if (m.sel !== null) {
				  m.sel.clear()
				}
				cursors.delete(clientId)
			}
			  
			const aw = awareness.getStates().get(clientId);
	
			if (aw === undefined) {
				CoCreateCursors.removeCursor(clientId)
				return
			}
			const user = aw.user || {}
			if (user.color == null) {
				user.color = '#ffa500'
			}
			if (user.name == null) {
				user.name = `User: ${clientId}`
			}
			const cursor = aw.cursor
			if (cursor == null || cursor.anchor == null || cursor.head == null) {
				CoCreateCursors.removeCursor(clientId)
				return
			}
			// const start = cursor.anchor.item.clock;
			// const end = cursor.head.item.clock;

			const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.anchor), y)
			const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.head), y)
			if (anchor !== null && head !== null ) {
				let	start = anchor.index;
				let end = head.index;
				let info = this.parseName(cursor.anchor['tname']);
				
				// Todo: pass json to cursors and let cursors query for its elements
				let json = {};
				let id_mirror = info.document_id + info.name+'--mirror-div';
				let selector = '[collection="'+info.collection+'"][document_id="'+info.document_id+'"][name="'+info.name+'"]'
				selector += ':not(.codemirror):not(.quill):not(.monaco)';
				
				let elements = document.querySelectorAll(selector);
				elements.forEach(function (element, index, array) {
					json = {
						element: element,
						selector: selector,
						start: start,
						end: end,
						clientId: clientId,
						user:{
							'color':user.color,
							'name':user.name
						},
					}
					CoCreateCursors.draw_cursor(json);
				});
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
		let name = {org: data.org, collection: data.collection, document_id: data.document_id}
		return {
			id: btoa(JSON.stringify(name)),
			collection: data.collection,
			document_id: data.document_id,
			name: data.name
		}
	}
	
	generateDocName(info) {
		let docName = {org: config.organization_Id, collection: info.collection, document_id: info.document_id}
		return btoa(JSON.stringify(docName));        
	}
	
	generateTypeName(info) {
		let nameId = {org: config.organization_Id, collection: info.collection, document_id: info.document_id, name: info.name}
		return btoa(JSON.stringify(nameId));        
	}
}

export default CoCreateCrdtInit;
