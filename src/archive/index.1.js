import CoCreateCrdt from "./core.js"
import * as Y from 'yjs'
import crud from '@cocreate/crud-client';


class CoCreateCRDTClass extends CoCreateCrdt 
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
	init(info) {
		try {
			this.__validateKeysJson(info, ['collection', 'document_id', 'name']);
			
			const id = this.__getYDocId(info['collection'], info['document_id'], info['name'])

			if (!id) return;
			const status = this.createDoc(id, info.element)
			// console.log("InitCrdt")
		} catch(e) {
			console.log('Invalid param', e);
		}
	}

	/*. init data function
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
		
		const id = this.__getYDocId(info.collection, info.document_id, info.name)
		if (!id) return;

		if (info.updateCrud != false) info.updateCrud = true;
		
		if (this.getType(id) ) {
			let oldData = this.getType(id).toString();
			let textValue = info.value.toString();
			if (oldData && oldData.length > 0) {
				this.deleteData(id, 0, Math.max(oldData.length, textValue.length));
			}
			this.insertData(id, 0, textValue);
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
				this.__validateKeysJson(info,['collection','document_id','name','value','position']);
				let id = this.__getYDocId(info['collection'], info['document_id'], info['name'])
				if (id) {
					
					this.insertData(id, info['position'], info['value'].toString(), info['attributes']);
					
					let wholestring = this.getType(id).toString();
					
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
			this.__validateKeysJson(info,['collection','document_id','name', 'position','length']);
			let id = this.__getYDocId(info['collection'], info['document_id'], info['name'])
			if (id) {
				this.deleteData(id, info['position'], info['length']);
				
				let wholestring = this.getType(id).toString();
				
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
			this.__validateKeysJson(info,['collection','document_id','name']);
			let id = this.__getYDocId(info['collection'], info['document_id'], info['name'])
			if (id) {
				return this.getWholeString(id);
			} else {
				return "";
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
 
	__getYDocId(collection, document_id, name) {
		if (!crud.checkAttrValue(collection) || 
				!crud.checkAttrValue(document_id) || 
				!crud.checkAttrValue(name)) 
		{
			return null;
		}
		return this.generateID(config.organization_Id, collection, document_id, name);
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

