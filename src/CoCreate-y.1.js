
import * as Y from 'yjs'
import { WebsocketProvider } from './lib/y-websocket'
import { fetchUpdates, storeState, IndexeddbPersistence} from 'y-indexeddb'
// import { UserCursor } from './utils/cursor/userCursor_class'

// Connect to the web worker
const debug = true;
const g_yDoc = new Y.Doc();


export class CoCreateYSocket {
	constructor(org) {
		this.doc = g_yDoc;
		this.orgName = org;
		this.docs = {};
		this._awarenessListener = null;
		this.character = '_';
		this.listenAwereness = function(){}
	}
	
	createDoc(id, element) {
		if (!id || id == "") {
			return null;
		}
		
		let newInfo = this.parseType(id)
		console.log(newInfo);
		
		const newId = newInfo.id;
		
		if (this.docs[newId]) { 
			if (element && !this.__checkExistElement(this.docs[newId].elements, element)) {
				this.docs[newId].elements.push(element);
			}

			if (!this.docs[newId].types.some((type) => type === id)) {
				// register event
				this.docs[newId].types.push(id);
				this.registerUpdateEvent(this.docs[newId], id)
				
			}
			return false;
		} 
		
		const yDoc = this.doc
		
		const url_socket = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}//server.cocreate.app:8080/`;
		var socketProvider = new WebsocketProvider(url_socket, newId, yDoc);
		
		const indexeddbProvider = new IndexeddbPersistence(newId, g_yDoc)
		indexeddbProvider.whenSynced.then(() => {
		  console.log('loaded data from indexed db')
		})
		//draw cursor dinamially
		// new UserCursor(socketProvider);

		
		
		let awareness = socketProvider.awareness;
		
		this._cursors = new Map();
		
		this._awarenessListener = event => {
		  const f = clientId => {
			if (clientId !== this.doc.clientID) {
			  //this.updateRemoteSelection(yDoc, id, yDoc.getText(id), this._cursors, clientId, awareness)
			}
		  }
		  event.added.forEach(f)
		  event.removed.forEach(f)
		  event.updated.forEach(f)
		}
		
		awareness.on('change', this._awarenessListener);
		
		awareness.getStates().forEach((aw, clientId) => {
			console.log("Update --")
        })
        
        this.docs[newId] = {
			id: newId,
			doc: yDoc,
			socket: socketProvider,
			awareness: awareness,
			elements: element ? [element] : [],
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
			_this.__setTypeObserveEvent(event, docObject.elements, id);
		})
	}
	
	__checkExistElement(elements, element) {
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].isSameNode(element)) {
				return true;
			}
		}
		return false;
	}
	
	__setTypeObserveEvent(event, elements, id) {
		
		if (!id) return;

		const eventDelta = event.delta;
		const info = JSON.parse(atob(id));
		
		const wholestring = event.target.toString()
		
		const update_event = new CustomEvent('cocreate-y-update', {
			detail: eventDelta
		})
		const store_event = new CustomEvent('store-content-db', {
			detail: wholestring
		})
		let is_save_value = false
		if (typeof info !== 'object') {
			return;
		}

		elements.forEach((el) => {
			if (CoCreateUtils.isReadValue(el) && el.getAttribute('name') === info.name) {
				el.dispatchEvent(update_event)
			}
		})
		if (event.transaction.origin) {
			elements.forEach((el) => {
				if (el.getAttribute('data-save_value') != 'false' && el.getAttribute('name') === info.name) {
					is_save_value = true;
					el.dispatchEvent(store_event)
				}
			})

			if (is_save_value) {
				CoCreate.updateDocument({
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
	
	deleteDoc(id) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			delete this.docs[info.id];
		}
	}
	
	generateDocName(collection, document_id, name) {
		const info = {org: this.orgName, collection, document_id, name}
		return btoa(JSON.stringify(info)); 
		// return this.orgName + "_" + collection + "_" + document_id + "_" + name;
	}
	
	insertData(id, index, content, attribute) {
		const info = this.parseType(id)
		
		if (this.docs[info.id]) {
			if (attribute) {
				this.docs[info.id].doc.getText(id).insert(index, content, attribute);
			} else {
				
				this.docs[info.id].doc.getText(id).insert(index, content);
			}
		}
	}
	
	deleteData(id, index, length) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			this.docs[info.id].doc.getText(id).delete(index, length);
		}
	}
	
	getWholeString(id) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			return this.docs[info.id].doc.getText(id).toString();
		} else {
			return "";
		}
	}
	
	updateRemoteSelection (y, cm, type, cursors, clientId, awareness)  {
		if(debug)
				console.log("CHANGE ---- DOCID ",this.doc.clientID,' OTHER CLIENTEID ',clientId)
		if(clientId !== this.doc.clientID){
			
					//console.log("TEXT -> updateRemoteSelection ",clientId,awareness,cursor)
					//console.log("AW status",awareness.getLocalState())
					  // destroy current text mark
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
					  if(debug)
						console.log(aw)
					  if (aw === undefined) {
						  if(debug)
							console.log(" Cursor OUT ",clientId)
						   //awareness.setLocalStateField('cursor', null);
						   let elements = document.querySelectorAll('[id*="socket_'+clientId+'"]');
							elements.forEach(function (element, index, array) {
								element.parentNode.removeChild(element);
							})
							
							let sel_elements = document.querySelectorAll('[id*="sel-'+clientId+'"]');
							  sel_elements.forEach(function (sel_element, index, array) {
								sel_element.parentNode.removeChild(sel_element);
							})
						  /*
						   let element = document.getElementById("socket_"+clientId)
						   let sel_element = document.getElementById("sel-"+clientId)
						   if(element)
							element.parentNode.removeChild(element);
							if(sel_element)
							sel_element.parentNode.removeChild(sel_element);
						   */
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
					  if(debug)
						console.log("Cursor ",cursor)
					  if (cursor == null || cursor.anchor == null || cursor.head == null) {
						  //let element = document.getElementById("socket_"+clientId)
						  let elements = document.querySelectorAll('[id*="socket_'+clientId+'"]');
						  elements.forEach(function (element, index, array) {
							element.parentNode.removeChild(element);
						  })
						
						//let sel_element = document.getElementById("sel-"+clientId)  
						let sel_elements = document.querySelectorAll('[id*="sel-'+clientId+'"]');
						  sel_elements.forEach(function (sel_element, index, array) {
							sel_element.parentNode.removeChild(sel_element);
						})
						return
					  }

					  const anchor = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.anchor), y)
					  const head = Y.createAbsolutePositionFromRelativePosition(Y.createRelativePositionFromJSON(cursor.head), y)
					  //draw_cursor(1,11,12,66,{},true);
					  console.log("PRE Draw Cursor ")
					  if (anchor !== null && head !== null && anchor.type === type && head.type === type) {
						let from, to;
						if (head.index < anchor.index) {
						  from = head.index
						  to = anchor.index
						} else {
							if(debug)
								console.log(anchor.index)
						  from = anchor.index
						  to = head.index
						}
						if(debug)
							console.log("Draw Cursor ",from,to,clientId,aw.user)
						let t_info = CoCreateYSocket.parseTypeName(cursor.anchor['tname']);
						let id_mirror = t_info.document_id + t_info.name+'--mirror-div';
						let json = {};
						let selector = '[data-collection="'+t_info.collection+'"][data-document_id="'+t_info.document_id+'"][name="'+t_info.name+'"]'
						selector += ':not(.codemirror):not(.quill)';
						let elements = document.querySelectorAll(selector);
						let that = this;
						elements.forEach(function (element, index, array) {
							json = {
								element:element,
								startPosition:from,
								selector:selector,
								endPositon:to,
								clientId : clientId,
								user:{
									'color':aw.user.color,
									'name':aw.user.name
									},
							}
							draw_cursor(json);
							//sent custom position
							that.listen(json);
						});
					  }
		}
	}
	
	changeListenAwereness(callback){
		this.listenAwereness = callback;
	}
	
	listen(json){
		this.listenAwereness.apply(this,[json])
	}
	
	destroyObserver(id, element) {
		const info = this.parseType(id)
		this.docs[info.id].doc.getText(id).unobserve((event) => {});
		
		this.docs[info.id].socket.awareness.off('change', this._awarenessListener);
	}
	
	getProvider(id){
		const info = this.parseType(id)
		if (!this.docs[info.id]) {
			return null;
		}
		return this.docs[info.id].socket;
	}
	
	getType(id){
		const info = this.parseType(id)
		if (!this.docs[info.id]) {
			return null;
		}
		return this.docs[info.id].doc.getText(id);
	}

	setCursorNull(id){
		const info = this.parseType(id)
		if (!this.docs[info.id]) {
			return null;
		}
		this.docs[info.id].socket.awareness.setLocalStateField('cursor', null);
	}
	
	setPositionYJS(id, from, to) {
		const info = this.parseType(id)
		const type = this.getType(id);
		if (!type) {
			return;
		}
		var anchor = Y.createRelativePositionFromTypeIndex(type, from)
		var head = Y.createRelativePositionFromTypeIndex(type, to)
		if(debug)
			console.log("Sending Cursor ",{
				anchor,
				head
			},{'to':to,'from':from})
		this.docs[info.id].socket.awareness.setLocalStateField('cursor', {
			anchor,
			head
		})
		if(debug)
			console.log("Cursor Send")
	}
	
	//send Position Custom
	sendPosition(json) {
		let collection = json['collection'];
		let document_id = json['document_id'];
		let name = json['name'];
		let from = json['startPosition'];
		let to = json['endPositon'];
		let id = CoCreateYSocket.generateID(config.organization_Id, collection, document_id, name);
		this.setPositionYJS(id,from,to);
	}
	
	// setPositionYJS(id, from, to) {
	//     const type = this.doc.getText(id);
		
	//     var anchor = Y.createRelativePositionFromTypeIndex(type, from)
	//     var head = Y.createRelativePositionFromTypeIndex(type, to)
	//     this.awareness.setLocalStateField('cursor', {
	//         anchor,
	//         head
	//     })
	// }
	
	static generateID(org, collection, document_id, name) {
		const info = {org, collection, document_id, name}
		return btoa(JSON.stringify(info));        
		// return org + "_" + collection + "_" + document_id + "_" + name;
	}
	
	static parseTypeName(name) {
		//console.log(name)
		const data = JSON.parse(atob(name));
		//console.log(data)
		return data;
	}
	
	parseType(id) {
		let data = JSON.parse(atob(id));
		
		let newId = {org: data.org, collection: data.collection, document_id: data.document_id}
		return {
			id: btoa(JSON.stringify(newId)),
			name: data.name
		}
	}
}

window.CoCreateYSocket = CoCreateYSocket;

window.CoCreateCrdt = new CoCreateYSocket(config.organization_Id);