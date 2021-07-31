import CoCreateCrdtInit from "./core.js"
import * as Y from 'yjs'
import crud from '@cocreate/crud-client';


class CoCreateCRDTClass extends CoCreateCrdtInit 
{
	constructor(org, doc) {
		super(org, doc)
	}

	/*
	crdt.init({
		collection: "module",
		document_id: "",
		name: "",
		element: dom_object,
		metadata: "xxxx"
	})
	*/
	init({collection, document_id, name}) {
		try {
			// this.__validateKeysJson(info, ['collection', 'document_id', 'name']);
			
			if (!collection || !document_id || !name) return;
				this.createDoc(collection, document_id, name)

		} catch(e) {
			console.log('Invalid param', e);
		}
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
		if (!info) return;
		
		let docId = this.generateDoc(info['collection'], info['document_id']);
		let name = this.generateName(info['document_id'], info['name'])
		

		if (info.updateCrud != false) info.updateCrud = true;
		
		if ( this.docs[docId.id].doc.getText(name) ) {
			let oldData = this.docs[docId.id].doc.getText(name).toString();
			let textValue = info.value.toString();
			if (oldData && oldData.length > 0) {
				this.deleteText(info['collection'], info['document_id'], info['name'], 0, Math.max(oldData.length, textValue.length));
			}
			this.insertText(info['collection'], info['document_id'], info['name'], 0, textValue);
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
	insertText(info){
		try {
			// this.__validateKeysJson(info,['collection','document_id','name','value','position']);
			let docId = this.generateDoc(info['collection'], info['document_id'])
			let name = this.generateName(info['document_id'], info['name'])
			
			if (docId && name) {
				this.docs[docId.id].doc.getText(name).insert(info['position'], info['value'], info['attribute']);
				let wholestring = this.docs[docId.id].doc.getText(name).toString();
				
				console.log(wholestring)
				
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
			// this.__validateKeysJson(info,['collection','document_id','name', 'position','length']);
			let docId = this.generateDoc(info['collection'], info['document_id'])
			let name = this.generateName(info['document_id'], info['name'])
			
			if (docId && name) {
				this.docs[docId.id].doc.getText(name).delete(info['position'], info['length']);
				let wholestring = this.docs[docId.id].doc.getText(name).toString();
				
				console.log(wholestring)
				
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
			// this.__validateKeysJson(info,['collection','document_id','name']);
			let docId = this.generateDoc(info['collection'], info['document_id'])
			let name = this.generateName(info['document_id'], info['name'])
			
			if (docId && name) {
			return this.docs[docId.id].doc.getText(name).toString();
		} else {
			return "--";
		}
		}
		catch (e) {
			console.error(e); 
			return "";
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
 
	__validateKeysJson(json,rules){
		let keys_json = Object.keys(json);
		keys_json.forEach(key=>{
			const index = rules.indexOf(key);
			if(index != -1)
				rules.splice(index, 1);
		});
		if( rules.length )
			throw "Requires the following "+ rules.toString();
	}
}

let CoCreateCrdt = null;
if (!window.CoCreateCrdt) {
	const crdtDoc = new Y.Doc();
	CoCreateCrdt = new CoCreateCRDTClass(config.organization_Id, crdtDoc);
	window.Y = Y;
	window.CoCreateCrdt = CoCreateCrdt;
} else {
	CoCreateCrdt = window.CoCreateCrdt;
}

export default CoCreateCrdt;

