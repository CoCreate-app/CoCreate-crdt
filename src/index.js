/*globals config, atob, btoa, localStorage, CustomEvent*/
import crud from '@cocreate/crud-client';
import message from '@cocreate/message-client';
import uuid from '@cocreate/uuid';
import action from '@cocreate/action';

const docs = new Map();
const clientId = config.clientId || window.CoCreateSockets.clientId || uuid.generate(12);


function init(info){
	getText(info).then(value => {
		info.value = value;
		info.start = 0;
		info['clientId'] = clientId;
		localChange(info);
	});
}

async function getDoc(info) {
	try {
		let docName = generateDocName(info);
		let typeName = info.name;

		if (!docs.has(docName)) {
			let docNameMap = new Map();
			docs.set(docName, docNameMap);
		}
		
		if (!docs.get(docName).has(typeName)) {
			let typeNameMap = new Map();
			docs.get(docName).set(typeName, typeNameMap);
		}
		
		if (!docs.get(docName).get(typeName).has('changeLog')) {
			let changeLog = [];
			docs.get(docName).get(typeName).set('changeLog', changeLog);
			
			if (info.read != 'false') {
				let response = await crud.readDocumentList({		      
					collection: "crdt-transactions",
					operator: {
						filters: [{
							name: 'docName',
							operator: "$eq",
							value: [docName]
						}]
					}
				});
				if (response.data.length && response.data[0][typeName]) {
					changeLog = response.data[0][typeName];
					docs.get(docName).get(typeName).set('changeLog', changeLog);
				}
			}
			generateText(info);
		}
		return true;
	}
	catch (e) {
		console.log('Invalid param', e);
	}
}

String.prototype.customSplice = function (index, absIndex, string) {
    return this.slice(0, index) + string+ this.slice(index + Math.abs(absIndex));
};

async function generateText(info) {
	try {
		let name = docs.get(`${info.collection}${info.document_id}`).get(info.name);
		let string = '';
		let changeLog = name.get('changeLog');
		for (let change of changeLog) {
			string = string.customSplice(change.start, change.length, change.value);
		}
		name.set('text', string);
		if (string == '' && info.read != 'false')
			checkDb(info);
	}
	catch (e) {
		console.error(e);
	}
}

function checkDb(info) {
	let { collection, document_id, name } = info;
	crud.readDocument({ collection, document_id, name }).then(response => {
		if (!response) return;
		let string = response.data[name];
		if (string) {
			info.value = string;
			info.start = 0;
			insertChange(info);
		}
	});
}

function insertChange(info, broadcast, flag) {
	let docName = generateDocName(info);
	let typeName = info.name;
	let type = 'insert';
	
	if(info.start == undefined) return;
	if (!info.value)
		type = 'delete';
	
	let change = {
		datetime: info.datetime || new Date().toISOString(),
		value: info.value || '',
		start: info.start,
		end: info.end,
		length: info.length || 0,
		clientId: info.clientId || clientId,
		user_id: info.user_id || localStorage.getItem("user_id"),
		type
	};
	
	let name = docs.get(docName).get(typeName);
	let changeLog = name.get('changeLog');

	let lastChange = changeLog[changeLog.length - 1];
	if (lastChange && change.datetime && lastChange.datetime){
		if (change.datetime < lastChange.datetime){
			console.log('requires changeLog rebuild');
		}
		if (flag != 'replace') {
			if (lastChange && change.start == lastChange.start) {
				let date1 = new Date(lastChange.datetime);
				let date2 = new Date(change.datetime);
				let diff = date2.getTime() - date1.getTime();
				if (diff < 500) {
					if (change.value.length == 1) {
						change.start = lastChange.start + lastChange.value.length;
						info.start = change.start;
					}
					if (change.length == 1) {
						change.start = lastChange.start - lastChange.length;
						info.start = change.start;
					}
				}
			}
		}
	}
	changeLog.push(change);
	let string = name.get('text') || '';
	name.set('text', string.customSplice(change.start, change.length, change.value));
		
	if(!info.clientId){
		info['datetime'] = change.datetime;
		info['clientId'] = change.clientId;
		
		broadcastChange(info);
		localChange(info);
	}
	else
		localChange(info);
		
	if (info.clientId == clientId && info.save != "false")
		persistChange(info);
}

function undoChange(){
	
}

function redoChange(){
	
}

function broadcastChange(info){
	message.send({
		room: "",
		broadcast_sender: 'false',
		emit: {
			message: "crdt",
			data: info
		}
	});
}

function localChange(data) {
	const localChange = new CustomEvent('cocreate-crdt-update', {
		detail: { ...data },
	});
	window.dispatchEvent(localChange);
}

function persistChange(info) {
	let docName = generateDocName(info);
	let typeName = info.name;
	let name = docs.get(docName).get(typeName);
	let changeLog = name.get('changeLog');
	crud.updateDocument({
		collection: 'crdt-transactions',
		document_id: info.document_id,
		data: {
			docName,
			[typeName]: changeLog
		},
		upsert: true,
		namespace: info.namespace,
		room: info.room,
		broadcast: info.broadcast,
		broadcast_sender: info.broadcast_sender,
		metadata: 'crdt-change'
	});
}

message.listen('crdt', function(data) {
	if (docs.get(`${data.collection}${data.document_id}`)){
		if (docs.get(`${data.collection}${data.document_id}`).get(data.name))
		if (data.clientId !== clientId){
			insertChange(data);
		}
	}
});

/*
crdt.getText({
	collection: 'modules',
	document_id: '5e4802ce3ed96d38e71fc7e5',
	name: 'name'
})
*/
async function getText(info) {
	try {
		let docName = generateDocName(info);
		let typeName = info.name;
		let doc = await getDoc(info);
		if (doc) {
			return docs.get(docName).get(typeName).get('text');
		}
	}
	catch (e) {
		console.error(e);
		return "";
	}
}


/*
crdt.replaceText({
	collection: "module",
	document_id: "",
	name: "",
	value: "",
	crud: true | false,
	element: dom_object,
	metadata: "xxxx"
})
*/
async function replaceText(info) {
	try {
		let doc = await getDoc(info);
		if (doc) {
			let oldValue = await getText(info);
			if (oldValue)
				info.length = oldValue.length;
			else 
				info.length = 0;

			info.start = 0;
			updateText(info, 'replace');
		}
	}
	catch (e) {
		console.error(e);
	}
}

/*
crdt.updateText({
	collection: 'module_activities',
	document_id: '5e4802ce3ed96d38e71fc7e5',
	name: 'name',
	value: 'T',
	start: '8',
	attributes: {bold: true} 
	length: 2, // length is used to define charcters that will be deleted
})
*/
async function updateText(info, flag) {
	let broadcast = true;
	let doc = await getDoc(info);
	if (doc) {
		
		insertChange(info, broadcast, flag);
		
		if (info.crud != 'false' && info.save != 'false') {
			let wholestring = await getText(info);
			crud.updateDocument({
				collection: info.collection,
				document_id: info.document_id,
				data: {
					[info.name]: wholestring
				},
				upsert: info.upsert,
				namespace: info.namespace,
				room: info.room,
				broadcast: info.broadcast,
				broadcast_sender: info.broadcast_sender,
				metadata: 'crdt-change'
			});
		}
	}
}



// function deleteDoc(docName) {
// 	if (this.docs[docName]) {
// 		delete this.docs[docName];
// 	}
// }

// function destroyObserver(docName, typeName) {
// 	this.docs[docName].doc.getText(typeName).unobserve((event) => {});
// 	this.docs[docName].socket.awareness.off('change', this._awarenessListener);
// }

function generateDocName(info) {
	let docName = { collection: info.collection, document_id: info.document_id };
	return `${info.collection}${info.document_id}`;
	// return btoa(JSON.stringify(docName));
}

action.init({
	action: "undo",
	endEvent: "undo",
	callback: (btn, data) => {
		undoChange(btn);
	}
});

action.init({
	action: "redo",
	endEvent: "redo",
	callback: (btn, data) => {
		redoChange(btn);
	}
});

export default { init, getText, updateText, replaceText };
