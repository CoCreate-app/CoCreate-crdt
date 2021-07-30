import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { fetchUpdates, storeState, IndexeddbPersistence } from 'y-indexeddb'
import crud from '@cocreate/crud-client';
import CoCreateCursors from '@cocreate/cursors'
import { logger } from '@cocreate/utils'

let console = logger('off');

class CoCreateYSocket {
	constructor(org, ydoc) {
		this.doc = ydoc;
		this.orgName = org;
		this.docs = {};
		this._awarenessListener = null;
		this.character = '_';
		this.listenAwereness = function(){}
	}
	
	createDoc(id) {
		if (!id || id == "") {
			return null;
		}
		
		let newInfo = this.parseType(id)

		const newId = newInfo.id;
		
		if (this.docs[newId]) { 
			if (!this.docs[newId].types.some((type) => type === id)) {
				// register event
				this.docs[newId].types.push(id);
				this.registerUpdateEvent(this.docs[newId], id)
				
			}
			return false;
		} 
		
		const yDoc = this.doc
		
		const url_socket = this.__getSocketUrl();

		var socketProvider = new WebsocketProvider(url_socket, newId, yDoc);
		
		let indexeddbProvider = null;
		if (newInfo.document_id != "null") {
			indexeddbProvider = new IndexeddbPersistence(newId, this.doc)
			indexeddbProvider.whenSynced.then(() => {
			  console.log('loaded data from indexed db')
			})
		}	
		
		let awareness = socketProvider.awareness;
		
		this._cursors = new Map();
		
		this._awarenessListener = event => {
		  const f = clientId => {
		//	if (clientId !== this.doc.clientID) {
			  this.updateRemoteSelection(yDoc, id, yDoc.getText(id), this._cursors, clientId, awareness)
		//	}
		  }
		  event.added.forEach(f)
		  event.removed.forEach(f)
		  event.updated.forEach(f)
		}
		
		awareness.on('change', this._awarenessListener);

        this.docs[newId] = {
			id: newId,
			doc: yDoc,
			socket: socketProvider,
			awareness: awareness,
			types: [id],
			indexeddb: indexeddbProvider
		}
		this.registerUpdateEvent(this.docs[newId], id)

		return true;
	}
	
	registerUpdateEvent(docObject, id) {
		const yDoc = docObject.doc;
		const shardType = yDoc.getText(id)
		let _this = this;
		
		shardType.observe((event) => {
			_this.__setTypeObserveEvent(event, id);
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
	
	__setTypeObserveEvent(event, id) {
		console.log('set crdt event .', event.delta)
		if (!id) return;

		const eventDelta = event.delta;
		
		if (eventDelta.length == 0) {
			return;
		}
		const info = JSON.parse(atob(id));
		let is_save_value = false
		
		// let is_crud = eventDelta.attributes && eventDelta.attributes.crud === false ? false : true;
		
		const wholestring = event.target.toString()
		const store_event = new CustomEvent('store-content-db', {
			detail: wholestring
		})
		
		const update_event = new CustomEvent('cocreate-crdt-update', {
			detail: {eventDelta,...info}, 
		})
		
		window.dispatchEvent(update_event);
	}
	
	//send Position Custom
	sendPosition(collection, document_id, name, from, to) {
		let id = this.generateID(config.organization_Id, collection, document_id, name);
		const info = this.parseType(id)
		const type = this.getType(id);
		console.log("Type ",type)
		if (!type) {
			return;
		}
		if (from != null && to != null){
			var anchor = Y.createRelativePositionFromTypeIndex(type, from)
			var head = Y.createRelativePositionFromTypeIndex(type, to)
			
				console.log("Sending Cursor ",{
					anchor,
					head
				},{'to':to,'from':from,'info.id':info.id})
			
			this.docs[info.id].socket.awareness.setLocalStateField('cursor', {
				anchor,
				head
			})
		}
		else {
			this.docs[info.id].socket.awareness.setLocalStateField('cursor', null);
		}
			
	}
	
	updateRemoteSelection (y, cm, type, cursors, clientId, awareness)  {
		console.log("CHANGE ---- DOCID ",this.doc.clientID,' OTHER CLIENTEID ',clientId)
		// ToDo: blocks character inserts
		if(clientId !== this.doc.clientID){
			
			const m = cursors.get(clientId)
				if (m !== undefined) {
					m.caret.clear()
				if (m.sel !== null) {
				  m.sel.clear()
				}
				cursors.delete(clientId)
			}
			  
			// redraw caret and selection for clientId
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
		
			const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.anchor), y)
			const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.head), y)
			// const anchor = cursor.anchor
			// const head = cursor.head
			
			if (anchor !== null && head !== null ) {
	
				let	from = anchor.index
				let to = head.index
				
				let info = this.parseType(cursor.anchor['tname']);
				
				let id_mirror = info.document_id + info.name+'--mirror-div';
				let json = {};
				
				let selector = '[collection="'+info.collection+'"][document_id="'+info.document_id+'"][name="'+info.name+'"]'
				selector += ':not(.codemirror):not(.quill):not(.monaco)';
				
				let elements = document.querySelectorAll(selector);
				
				let that = this; // does it matter the position this is placed
				elements.forEach(function (element, index, array) {
					json = {
						element:element,
						selector:selector,
						startPosition:from,
						endPositon:to,
						clientId : clientId,
						user:{
							'color':user.color,
							'name':user.name
						},
					}
					
					CoCreateCursors.draw_cursor(json);
					//sent custom position
					that.listenAwereness.apply(this,[json]);
				});
			}
		}
	}
	
	listen(json){
		this.listenAwereness.apply(this,[json])
	}
	
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
	
	deleteDoc(id) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			delete this.docs[info.id];
		}
	}
	
	destroyObserver(id) {
		const info = this.parseType(id)
		this.docs[info.id].doc.getText(id).unobserve((event) => {});
		
		this.docs[info.id].socket.awareness.off('change', this._awarenessListener);
	}
	
	getType(id){
		const info = this.parseType(id)
		if (!this.docs[info.id]) {
			return null;
		}
		return this.docs[info.id].doc.getText(id);
	}
	
	parseType(id) {
		let data = JSON.parse(atob(id));
		
		let newId = {org: data.org, collection: data.collection, document_id: data.document_id}
		return {
			id: btoa(JSON.stringify(newId)),
			collection: data.collection,
			document_id: data.document_id,
			name: data.name
		}
	}

	generateID(org, collection, document_id, name) {
		const info = {org, collection, document_id, name}
		return btoa(JSON.stringify(info));        
	}
}

export default CoCreateYSocket;
