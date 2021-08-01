import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { fetchUpdates, storeState, IndexeddbPersistence } from 'y-indexeddb'
import crud from '@cocreate/crud-client';
import CoCreateCursors from '@cocreate/cursors'

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
				this.registerUpdateEvent(this.docs[docName], typeName)
			}
			return false;
		} 
		
		const yDoc = this.doc
		const url_socket = this.__getSocketUrl();
		var socketProvider = new WebsocketProvider(url_socket, docName, yDoc);
		
		let indexeddbProvider = null;
		if (info.document_id != "null") {
			indexeddbProvider = new IndexeddbPersistence(docName, this.doc)
			indexeddbProvider.whenSynced.then(() => {
			  console.log('loaded data from indexed db')
			})
		}	
		
		let awareness = socketProvider.awareness;
		
		this._cursors = new Map();
		
		this._awarenessListener = event => {
		  const f = clientId => {
		//	if (clientId !== this.doc.clientID) {
			  this.updateRemoteSelection(yDoc, typeName, yDoc.getText(typeName), this._cursors, clientId, awareness)
		//	}
		  }
		  event.added.forEach(f)
		  event.removed.forEach(f)
		  event.updated.forEach(f)
		}
		
		awareness.on('change', this._awarenessListener);

        this.docs[docName] = {
			id: docName,
			doc: yDoc,
			socket: socketProvider,
			awareness: awareness,
			types: [typeName],
			indexeddb: indexeddbProvider
		}
		this.registerUpdateEvent(this.docs[docName], typeName)

		return true;
	}
	
	registerUpdateEvent(docName, typeName) {
		const yDoc = docName.doc;
		const shardType = yDoc.getText(typeName)
		let _this = this;
		
		shardType.observe((event) => {
			_this.__setTypeObserveEvent(event, typeName);
		})
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
		
		console.log(url_socket)
		url_socket += "crdt/";
		
		return url_socket;

	}
	
	__setTypeObserveEvent(event, typeName) {
		console.log('set crdt event .', event.delta)
		if (!typeName) return;

		const eventDelta = event.delta;
		
		if (eventDelta.length == 0) {
			return;
		}
		const info = JSON.parse(atob(typeName));
		let is_save_value = false
		
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
	
	updateRemoteSelection (y, cm, type, cursors, clientId, awareness)  {

		// ToDo: blocks character inserts because some time clientId are equal and should not be
		// if(clientId !== this.doc.clientID){
			
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
				this.removeCursor(clientId)
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
				this.removeCursor(clientId)
				return
			}
			// const start = cursor.anchor.item.clock;
			// const end = cursor.head.item.clock;

			const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.anchor), y)
			const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.head), y)
			if (anchor !== null && head !== null ) {
				let	start = anchor.index;
				let end = head.index;
			// }
			// if (start !== null && end !== null ) {
	
				// let	start = anchor.index
				// let end = head.index
				
				let info = this.parseName(cursor.anchor['tname']);
				
				let id_mirror = info.document_id + info.name+'--mirror-div';
				let json = {};
				
				let selector = '[collection="'+info.collection+'"][document_id="'+info.document_id+'"][name="'+info.name+'"]'
				selector += ':not(.codemirror):not(.quill):not(.monaco)';
				
				let elements = document.querySelectorAll(selector);
				// let that = this; // does it matter the position this is placed
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
					// that.listen(json);
				});
			// }
		}
	}
	
	// listen(json){
	// 	this.listenAwereness.apply(this,[json])
	// }
	
	removeCursor(clientId){
	   let elements = document.querySelectorAll('[id*="socket_'+clientId+'"]');
		elements.forEach(function (element, index, array) {
			element.parentNode.removeChild(element);
		})
		
		let sel_elements = document.querySelectorAll('[id*="sel-'+clientId+'"]');
		  sel_elements.forEach(function (sel_element, index, array) {
			sel_element.parentNode.removeChild(sel_element);
		})
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
