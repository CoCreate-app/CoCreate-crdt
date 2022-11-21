/*globals config, atob, btoa, localStorage, CustomEvent*/
import CRUD from '@cocreate/crud-client';
import message from '@cocreate/message-client';
import uuid from '@cocreate/uuid';

let crud
if(CRUD && CRUD.default)
	crud = CRUD.default
else
	crud = CRUD

const docs = new Map();
const clientId = crud.socket.clientId || uuid.generate(12);
const checkedDb = new Map();
const isInit = new Map();

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
		if (['_id', 'organization_id'].includes(info.name))
			return
		let docName = generateDocName(info);
		let typeName = info.name;
		let doc = docs.get(docName);
		
		if (!doc) {
			let docNameMap = new Map();
			docs.set(docName, docNameMap);
			doc = docs.get(docName);
		}
		
		let type = doc.get(typeName)
		if (!type) {
			let typeNameMap = new Map();
			doc.set(typeName, typeNameMap);
			type = doc.get(typeName)
		}
		if (!type.has('changeLog')) {
			let changeLog = [];
			
			let undoLog = new Map()
			type.set('undoLog', undoLog)
			
			let redoLog = new Map()
			type.set('redoLog', redoLog)
			
			if (info.read != 'false') {
				if (!info.newDocument) {
					let response = await crud.readDocument({		      
						collection: "crdt-transactions",
						filter: {
							query: [{
								name: 'docName',
								operator: "$eq",
								value: docName
							}]
						}
					});
					if (response.document.length && response.document[0][typeName]) {
						changeLog = response.document[0][typeName];
					}
				}
				type.set('changeLog', changeLog);
				await generateText(info, true);
			} 
		}
		else if (!type.has('text')){
			await generateText(info, false);
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

async function generateText(info, flag) {
	try {
		let name = docs.get(`${info.collection}${info.document_id}`).get(info.name);
		let string = '';
		let changeLog = name.get('changeLog');
		for (let change of changeLog) {
			if (change || change !== null ) {
				string = string.customSplice(change.start, change.length, change.value);
			}		
		}
		if (string === '' && info.read !== 'false') {
			string = await checkDb(info, flag);
		}
		name.set('text', string);
		return;
	}
	catch (e) {
		console.error(e);
	}
}

async function checkDb(info, flag) {
	let { collection, document_id, name } = info;
	if (checkedDb.get(`${collection}${document_id}${name}`)) return;
	checkedDb.set(`${collection}${document_id}${name}`, true);

	let string = ''
	if (info.newDocument)
		string = info.newDocument
	else {
		let response = await crud.readDocument({ collection, document: {_id: document_id, name}});
		string = crud.getObjectValueByPath(response.document[0], name);
	}
	if (string && flag != false) {
		info.value = string;
		info.start = 0;
		info.clientId = clientId;
		insertChange(info);
	}
	return string || '';
}

function insertChange(info, flag) {
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
	if (!changeLog)
		return

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
	if (!change || change == null ) {
		console.log('null change')
		return
	}
	let string = name.get('text') || '';
	if (change.length > 0)
		change.removedValue = string.substr(change.start, change.length);
	
	changeLog.push(change);
	name.set('text', string.customSplice(change.start, change.length, change.value));
	string = {string: name.get('text')};
	
	if(!info.clientId){
		info['datetime'] = change.datetime;
		info['clientId'] = change.clientId;
		
		broadcastChange(info);
		localChange(info, string);
	}
	else
		localChange(info, string);
		
	if (info.clientId == clientId && info.save != "false")
		persistChange(info);
}

function broadcastChange(info){
	message.send({
		room: "",
		broadcastSender: 'false',
		message: "crdt",
		data: info
	});
}

function localChange(data, string) {
	const localChange = new CustomEvent('cocreate-crdt-update', {
		detail: { ...data, ...string },
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
		document: {
			_id: info.document_id,
			docName,
			[typeName]: changeLog
		},
		upsert: true,
		namespace: info.namespace,
		room: info.room,
		broadcast: info.broadcast,
		broadcastSender: info.broadcastSender,
		metadata: 'crdt-change'
	});
}

message.listen('crdt', function(response) {
	let data = response.data
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
			let value = docs.get(docName).get(typeName).get('text')
			return value;
		}
		else {
			console.log('undefined')
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
	let doc = await getDoc(info);
	if (doc) {
		
		insertChange(info, flag);
		
		if (info.crud != 'false' && info.save != 'false') {
			let wholestring = await getText(info);
			crud.updateDocument({
				collection: info.collection,
				document: {
					_id: info.document_id,
					[info.name]: wholestring
				},
				upsert: info.upsert,
				namespace: info.namespace,
				room: info.room,
				broadcast: info.broadcast,
				broadcastSender: info.broadcastSender,
				metadata: 'crdt-change'
			});
		}
	}
}

function createChange(info, change){
	if (change.value && change.length == 0) {
		change.length = change.value.length
		change.removedValue = change.value
		change.value = '';
		change.type = 'delete';
	} else {
		change.value = change.removedValue
		change.length = 0;
		change.type = 'insert';
	}
	info = {...info, ...change};
	delete info.clientId
	delete info.datetime
	delete change.clientId
	delete change.datetime
	return {info, change}
}

function undoText(info){
	let docName = generateDocName(info);
	let typeName = info.name;

	let name = docs.get(docName).get(typeName);
	let changeLog = name.get('changeLog');
	let undoLog = name.get('undoLog')

	for (let index = changeLog.length - 1; index >= 0; index--) {
		let change =  Object.assign({}, changeLog[index]);
		if (change && change.clientId == clientId){
			let log = undoLog.get(index)
			if (!log) {
				if (log != 'undo') {
					undoLog.set(index, 'undo')
					change.index = changeLog.length += 1;
					let updated = createChange(info, change);
					undoLog.set(updated.change.index, updated.change)
					updateText(updated.info)
					return
				}
			}
		}
	}
}

function redoText(info){
	let docName = generateDocName(info);
	let typeName = info.name;

	let name = docs.get(docName).get(typeName);
	let redoLog = name.get('redoLog')
	let undoLog = Array.from(name.get('undoLog').values());

	for (let index = undoLog.length - 1; index >= 0; index--) {
		let change = Object.assign({}, undoLog[index]);
		if (change && change != 'undo') {
			let log = redoLog.get(change.index)

			if (!log) {
				if (log != 'redo') {
					let updated = createChange(info, change);
					redoLog.set(updated.change.index, updated.change)
					updateText(updated.info)
					return
				}
			}
		}
	}
}

async function viewVersion(data) {
	try {
		let name = docs.get(`${data.collection}${data.document_id}`).get(data.name);
		let string = '';
		let changeLog = name.get('changeLog');
		let log = changeLog.slice(0, data.version)
		for (let change of log) {
			if (change || change !== null ) {
				string = string.customSplice(change.start, change.length, change.value);
			}		
		}
		return { ...data, ...string }
	}
	catch (e) {
		console.error(e);
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

export default { init, getText, updateText, replaceText, undoText, redoText, viewVersion };
