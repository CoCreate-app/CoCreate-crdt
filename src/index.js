import CoCreateCrdtInit from "./core.js"
import * as Y from 'yjs'
import crud from '@cocreate/crud-client';


class CoCreateCRDTClass extends CoCreateCrdtInit {
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
			this.createDoc(info)
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
		let docName = this.generateDocName(info)
		let typeName = this.generateTypeName(info)

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
			let docName = this.generateDocName(info)
			let typeName = this.generateTypeName(info)
			if (docName) {
				this.docs[docName].doc.getText(typeName).delete(info['position'], info['length']);
				let wholestring = this.docs[docName].doc.getText(typeName).toString();
				
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