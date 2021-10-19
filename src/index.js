/*globals config, atob, btoa, CustomEvent*/
import crud from '@cocreate/crud-client';
import message from '@cocreate/message-client';

const docs = new Map();

function init(info){
	getDoc(info).then(response => {
		getText(info).then(value => {
			info.value = value;
			info.start = 0;
			let data = createDelta(info);
			updateEvent(data);
		});
	});
}

async function getDoc(info) {
	try {
		var docName = generateDocName(info);
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
			let response = await crud.readDocumentList({		      
				collection: "crdtNew",
				operator: {
					filters: [{
						name: 'name',
						operator: "$eq",
						value: [docName]
					}]
				},
			})
			
			let changeLog;
			if (response.data.length) {
				changeLog = response.data[0][typeName];
			}
			else {
				changeLog = [];
			}
			docs.get(docName).get(typeName).set('changeLog', changeLog);
			if (!changeLog.length)
				checkDb(info);
			// }
			// 	else if (!docs.get(docName).get(typeName).has('changeLog')) {
			// 		docs.get(docName).get(typeName).set('changeLog', changeLog);
			// 	}
			
			// });
			// let changeLog = [];
			// 	docs.get(docName).get(typeName).set('changeLog', changeLog);
			// 	checkDb(info);
		}
		
		if (!docs.get(docName).get(typeName).has('cursors')) {
			let cursorMap = new Map();
			docs.get(docName).get(typeName).set('cursors', cursorMap);
		}
		return true

	}
	catch (e) {
		console.log('Invalid param', e);
	}
}

function insertChange(info) {
	let docName = generateDocName(info);
	let typeName = info.name;
	let type = 'insert';
	const datetime = new Date
	if (info.legnth > 0)
		type = 'delete';
	let change = {
		datetime,
		value: info.value || '',
		start: info.start || 0,
		end: info.end || 0,
		legnth: info.length || 0,
		clientId: info.userId,
		type
	}
	let changeLog = docs.get(docName).get(typeName).get('changeLog');
	changeLog.push(change)
		
	crud.updateDocument({
		collection: 'crdtNew',
		document_id: info.document_id,
		data: {
			name: docName,
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

function checkDb(info) {
	let { collection, document_id, name } = info;
	crud.readDocument({ collection, document_id, name }).then(response => {
		let string = response.data[name];
		if (string) {
			info.value = string;
			insertChange(info)
		}
	});
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
async function replaceText(info) {
	try {
		let docName = generateDocName(info);
		let typeName = info.name;
		let doc = await getDoc(info);
		if (doc) {
		
			let oldValue = getText(info);
			let newValue = info['value'].toString();
			if (oldValue && oldValue.length > 0) {
				deleteText({ collection: info.collection, document_id: info.document_id, name: info.name, start: 0, length: Math.max(oldValue.length, newValue.length), crud: false });
			}
			insertText({ collection: info.collection, document_id: info.document_id, name: info.name, start: 0, value: newValue, crud: info.crud });
		}
	}
	catch (e) {
		console.error(e);
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
function insertText(info) {
	updateCrdt(info)
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

function deleteText(info) {
	updateCrdt(info)
}

async function updateCrdt(info) {
	try {
		// let docName = generateDocName(info);
		// let typeName = info.name;
		let doc = await getDoc(info);
		if (doc) {
			insertChange(info);

			changeEvent(info)
			
			if (info.crud != 'false') {
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
	catch (e) {
		console.error(e);
	}

}



function changeEvent(info){
	message.send({
		room: "",
		emit: {
			message: "crdt",
			data: createDelta(info)
		}
	});
}

message.listen('crdt', function(data) {
	updateEvent(data);	
});

function createDelta(info){
	let data = {
		collection: info.collection,
		document_id: info.document_id,
		name: info.name,
		eventDelta: [
			{ retain: info['start'] },
			{ insert: info['value'], attributes: info['attributes'] },
			{ delete: info['length'] }
		]
	}
	return data;
}

function updateEvent(data) {
	const updateEvent = new CustomEvent('cocreate-crdt-update', {
		detail: { ...data },
	});
	window.dispatchEvent(updateEvent);
}

/*
crdt.getText({
	collection: 'module_activities',
	document_id: '5e4802ce3ed96d38e71fc7e5',
	name: 'name'
})
*/

// String.prototype.splice = function(index, del, ...newStrs) {
// 	let str = this.split('');
// 	str.splice(index, del, newStrs.join('') || '');
// 	return str.join('');
// }
String.prototype.customSplice = function (index, absIndex, string) {
    return this.slice(0, index) + string+ this.slice(index + Math.abs(absIndex));
};

async function getText(info) {
	try {
		let docName = generateDocName(info);
		let typeName = info.name;
		let string = "";
		let doc = await getDoc(info);
		if (doc) {
			let changeLog = docs.get(docName).get(typeName).get('changeLog')
			for (let change of changeLog) {
				string = string.customSplice(change.start, change.legnth, change.value)
			}
			return string;
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
function getPosition(callback) {
	if (typeof miFuncion === 'function')
		this.changeListenAwereness(callback);
	else
		console.error('Callback should be a function');
}


function sendPosition(info) {
	try {
		let docName = generateDocName(info);
		let typeName = info.name;
		let type = docs.get(docName).get(typeName);
		let start = info.start;
		let end = info.end;
		let color = info.color;
		let name = info.name;
		info.user_id = info.user_id || "test";
		if (!type) return;
		if (start != null && end != null) {
			type.get('cursors').set(info.user_id, { start, end, color, name });
		}
		else {
			type.get('cursors').delete(info.user_id);
		}

		message.send({
			room: "",
			emit: {
				message: "cursor",
				data: {
					collection: info.collection,
					document_id: info.document_id,
					name: info.name,
					start,
					end,
					clientId: info.user_id || 'test',
					user: {
						'color': color,
						'name': name
					}
				}
			},
		});
	}
	catch (e) {
		console.error(e);
	}
}

message.listen('cursor', function(selection) {
	if (selection.start != null && selection.end != null) {
		const cursorUpdate = new CustomEvent('updateCursor', {
			detail: { selection },
		});
		window.dispatchEvent(cursorUpdate);
	}
	else {
		const cursorRemove = new CustomEvent('removeCursor', {
			detail: { clientId: selection.clientId },
		});
		window.dispatchEvent(cursorRemove);
	}
})

function removeCursor(clientId, aw) {
	const cursorRemove = new CustomEvent('removeCursor', {
		detail: { clientId, aw },
	});
	window.dispatchEvent(cursorRemove);
	return;

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

export default { init, getText, insertText, deleteText, replaceText, getPosition, sendPosition };
