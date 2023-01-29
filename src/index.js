/*globals config, atob, btoa, localStorage, CustomEvent*/
import crud from '@cocreate/crud-client';
import message from '@cocreate/message-client';
import uuid from '@cocreate/uuid';
import localStorage from '@cocreate/local-storage';

const docs = new Map();
const clientId = crud.socket.clientId || uuid.generate(12);
const checkedDb = new Map();
const isInit = new Map();

function init(data){
	getText(data).then(value => {
		data.value = value;
		data.start = 0;
		data['clientId'] = clientId;
		localChange(data);
	});
}

async function getDoc(data) {
	try {
		if (['_id', 'organization_id'].includes(data.name))
			return
		let docName = getDocName(data);
		let doc = docs.get(docName);
		
		if (!doc) {
			docs.set(docName, new Map());
			doc = docs.get(docName);
		}
		
		if (!doc.has('changeLog')) {
			let changeLog = [];
			doc.set('undoLog', new Map())
			doc.set('redoLog', new Map())
			
			if (data.read != 'false') {
				if (!data.newDocument) {
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
					if (response.document && response.document[0] && response.document[0].changeLog) {
						changeLog = response.document[0].changeLog;
					}
				}
				doc.set('changeLog', changeLog);
				await generateText(data, true);
			} 
		}
		else if (!doc.has('text')){
			await generateText(data, false);
		}
		return doc;
	}
	catch (e) {
		console.log('Invalid param', e);
	}
}

String.prototype.customSplice = function (index, absIndex, string) {
    return this.slice(0, index) + string+ this.slice(index + Math.abs(absIndex));
};

async function generateText(data, flag) {
	try {
		let doc = docs.get(getDocName(data))

		let string = '';
		let changeLog = doc.get('changeLog');
		for (let change of changeLog) {
			if (change || change !== null ) {
				string = string.customSplice(change.start, change.length, change.value);
			}		
		}
		if (string === '' && data.read !== 'false') {
			string = await checkDb(data, flag);
		}
		doc.set('text', string);
		return;
	}
	catch (e) {
		console.error(e);
	}
}

async function checkDb(data, flag) {
	let { collection, document_id, name } = data;
	if (checkedDb.get(`${collection}${document_id}${name}`)) return;
	checkedDb.set(`${collection}${document_id}${name}`, true);

	let string = ''
	if (data.newDocument)
		string = data.newDocument
	else {
		let response = await crud.readDocument({ collection, document: {_id: document_id, name}});
		string = crud.getValueFromObject(response.document[0], name);
	}
	if (string && typeof string !== 'string') 
		string = ""
	if (string && typeof string === 'string' && flag != false) {
		data.value = string;
		data.start = 0;
		data.clientId = clientId;
		insertChange(data);
	}
	return string || '';
}

function insertChange(data, flag) {
	let docName = getDocName(data);
	let doc = docs.get(docName);
	let changeLog = doc.get('changeLog');
	if (!changeLog)
		return

	let type = 'insert';	
	if (data.start == undefined) return;
	if (!data.value)
		type = 'delete';
	
	let change = {
		datetime: data.datetime || new Date().toISOString(),
		value: data.value || '',
		start: data.start,
		end: data.end,
		length: data.length || 0,
		clientId: data.clientId || clientId,
		user_id: data.user_id || localStorage.getItem("user_id"),
		type
	};
	
	let lastChange = changeLog[changeLog.length - 1];
	if (lastChange && change.datetime && lastChange.datetime){
		if (change.datetime < lastChange.datetime){
			// ToDo: insert change at index position and update start and end postions for every element after insert
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
						data.start = change.start;
					}
					if (change.length == 1) {
						change.start = lastChange.start - lastChange.length;
						data.start = change.start;
					}
				}
			}
		}
	}
	if (!change || change == null ) {
		console.log('null change')
		return
	}
	let string = doc.get('text') || '';
	if (change.length > 0)
		change.removedValue = string.substr(change.start, change.length);
	
	if (flag == 'replace') {
		// ToDo get current string and create new changeLog array then push new change
		changeLog = [change];
		doc.set('changeLog', changeLog)
	} else {
		changeLog.push(change);
	}

	doc.set('text', string.customSplice(change.start, change.length, change.value));
	string = doc.get('text');
	
	if (!data.clientId){
		data['datetime'] = change.datetime;
		data['clientId'] = change.clientId;
		
		broadcastChange(data);
		localChange(data, string);
	}
	else
		localChange(data, string);
		
	if (data.clientId == clientId && data.save != "false")
		persistChange(data);
}

function broadcastChange(data){
	message.send({
		room: "",
		broadcastSender: 'false',
		broadcastBrowser: 'once',
		message: "crdt",
		data
	});
}

function localChange(data, string) {
	const localChange = new CustomEvent('cocreate-crdt-update', {
		detail: { ...data, string },
	});
	window.dispatchEvent(localChange);
}

function persistChange(data) {
	let docName = getDocName(data);
	let doc = docs.get(docName);
	let changeLog = doc.get('changeLog');
	let text = doc.get('text');
	let Data = {
		collection: 'crdt-transactions',
		document: {
			_id: data.document_id,
			docName,
			changeLog,
			text,
			crud: {
				collection:	data.collection,
				document_id: data.document_id,
				name: data.name		
			}
		},
		upsert: true,
		namespace: data.namespace,
		room: data.room,
		broadcast: data.broadcast,
		broadcastSender: data.broadcastSender,
		metadata: 'crdt-change'
	}

	crud.updateDocument(Data);
}

message.listen('crdt', function(response) {
	let data = response.data
	let docName = getDocName(data);
	let doc = docs.get(docName);

	if (doc){
		if (data.clientId !== clientId){
			insertChange(data);
		}
	}
});

crud.listen('sync', function(data) {
	if (data.collection.includes('crdt-transactions')) {
		if (data.document && data.document[0]) {
			let Data = data.document[0];
			let docName = Data.docName;
			let doc = docs.get(docName);
			if (doc && Data.crud) {
				Data.crud.value = Data.text
				Data.crud.start = 0
				Data.crud.length = doc.get('text').length

				doc.set('changeLog', Data.changeLog)
				doc.set('text', Data.text)
				// ToDo: compare modified dates to check if arrays need to merged and orderd by date or if we just use server
				localChange(Data.crud, Data.text)
				console.log('crdtSync')
			}
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
async function getText(data) {
	try {
		let doc = await getDoc(data);
		if (doc) {
			let value = doc.get('text')
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
async function replaceText(data) {
	try {
		let doc = await getDoc(data);
		if (doc) {
			let oldValue = await getText(data);
			if (oldValue)
				data.length = oldValue.length;
			else 
				data.length = 0;

			data.start = 0;
			updateText(data, 'replace');
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
async function updateText(data, flag) {
	let doc = await getDoc(data);
	if (doc) {
		
		insertChange(data, flag);
		
		if (data.crud != 'false' && data.save != 'false') {
			let wholestring = await getText(data);
			crud.updateDocument({
				collection: data.collection,
				document: {
					_id: data.document_id,
					[data.name]: wholestring
				},
				upsert: data.upsert,
				namespace: data.namespace,
				room: data.room,
				broadcast: data.broadcast,
				broadcastSender: data.broadcastSender,
				metadata: 'crdt-updateDocument'
			});
		}
	}
}

function createChange(data, change){
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
	data = {...data, ...change};
	delete data.clientId
	delete data.datetime
	delete change.clientId
	delete change.datetime
	return {data, change}
}

function undoText(data){
	let docName = getDocName(data);
	let doc = docs.get(docName);
	let changeLog = doc.get('changeLog');
	let undoLog = doc.get('undoLog')

	for (let index = changeLog.length - 1; index >= 0; index--) {
		let change =  Object.assign({}, changeLog[index]);
		if (change && change.clientId == clientId){
			let log = undoLog.get(index)
			if (!log) {
				if (log != 'undo') {
					undoLog.set(index, 'undo')
					change.index = changeLog.length += 1;
					let updated = createChange(data, change);
					undoLog.set(updated.change.index, updated.change)
					updateText(updated.data)
					return
				}
			}
		}
	}
}

function redoText(data){
	let docName = getDocName(data);
	let doc = docs.get(docName);
	let redoLog = doc.get('redoLog')
	let undoLog = Array.from(doc.get('undoLog').values());

	for (let index = undoLog.length - 1; index >= 0; index--) {
		let change = Object.assign({}, undoLog[index]);
		if (change && change != 'undo') {
			let log = redoLog.get(change.index)

			if (!log) {
				if (log != 'redo') {
					let updated = createChange(data, change);
					redoLog.set(updated.change.index, updated.change)
					updateText(updated.data)
					return
				}
			}
		}
	}
}

async function viewVersion(data) {
	try {
		let docName = getDocName(data);
		let doc = docs.get(docName);
		let changeLog = doc.get('changeLog');
		let string = '';

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

function getDocName(data) {
	return `${data.collection}${data.document_id}${data.name}`;
}

export default { init, getText, updateText, replaceText, undoText, redoText, viewVersion };
