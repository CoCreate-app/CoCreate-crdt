/********************************************************************************
 * Copyright (C) 2023 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/

// Commercial Licensing Information:
// For commercial use of this software without the copyleft provisions of the AGPLv3,
// you must obtain a commercial license from CoCreate LLC.
// For details, visit <https://cocreate.app/licenses/> or contact us at sales@cocreate.app.

/*globals config, atob, btoa, localStorage, CustomEvent*/
import crud from '@cocreate/crud-client';
import message from '@cocreate/message-client';
import uuid from '@cocreate/uuid';
import localStorage from '@cocreate/local-storage';

const docs = new Map();
const frameId = crud.socket.frameId || uuid.generate(12);
const checkedDb = new Map();
const isInit = new Map();

function init(data) {
    getText(data).then(value => {
        data.value = value;
        data.start = 0;
        data['frameId'] = frameId;
        localChange(data);
    });
}

async function getDoc(data) {
    try {
        if (['_id', 'organization_id'].includes(data.key))
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
                if (!data.newObject) {
                    let response = await crud.send({
                        method: "read.object",
                        array: "crdt-transactions",
                        object: {
                            $filter: {
                                query: [{
                                    key: 'docName',
                                    operator: "$eq",
                                    value: docName
                                }],
                                limit: 1
                            }
                        }
                    });
                    if (response.object && response.object[0] && response.object[0].changeLog) {
                        changeLog = response.object[0].changeLog;
                    }
                }
                doc.set('changeLog', changeLog);
                await generateText(data, true);
            }
        } else if (!doc.has('text')) {
            await generateText(data, false);
        }
        return doc;
    } catch (e) {
        console.log('Invalid param', e);
    }
}

String.prototype.customSplice = function (index, absIndex, string) {
    return this.slice(0, index) + string + this.slice(index + Math.abs(absIndex));
};

async function generateText(data, flag) {
    try {
        let doc = docs.get(getDocName(data))

        let string = '';
        let changeLog = doc.get('changeLog');
        for (let change of changeLog) {
            if (change) {
                string = string.customSplice(change.start, change.length, change.value);
            }
        }

        if (string === '' && data.read !== 'false') {
            string = await checkDb(data, flag) || ''
        }

        doc.set('text', string);
        return string;
    } catch (e) {
        console.error(e);
    }
}

async function checkDb(data, flag) {
    let { array, object, key } = data;
    if (checkedDb.get(`${array}${object}${key}`)) return;
    checkedDb.set(`${array}${object}${key}`, true);

    let string = ''
    if (data.newObject)
        string = data.newObject
    else {
        let response = await crud.send({ method: 'read.object', array, object: { _id: object, key } });
        string = crud.getValueFromObject(response.object[0], key);
    }

    if (string && typeof string !== 'string')
        string = ""
    if (string && typeof string === 'string' && flag != false) {
        data.value = string;
        data.start = 0;
        data.frameId = frameId;
        insertChange(data);
    }

    return string;
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
        frameId: data.frameId || frameId,
        user_id: data.user_id || localStorage.getItem("user_id"),
        type
    };

    let lastChange = changeLog[changeLog.length - 1];
    if (lastChange && change.datetime && lastChange.datetime) {
        if (change.datetime < lastChange.datetime) {
            // TODO: insert change at index position and update start and end postions for every element after insert
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
    if (!change || change == null) {
        console.log('null change')
        return
    }
    let string = doc.get('text') || '';
    if (change.length > 0)
        change.removedValue = string.substring(change.start, change.length);

    if (flag == 'replace') {
        // TODO get current string and create new changeLog array then push new change
        changeLog = [change];
        doc.set('changeLog', changeLog)
    } else {
        changeLog.push(change);
    }

    doc.set('text', string.customSplice(change.start, change.length, change.value));
    string = doc.get('text');

    if (!data.frameId) {
        data['datetime'] = change.datetime;
        data['frameId'] = change.frameId;

        broadcastChange(data);
        localChange(data, string);
    } else
        localChange(data, string);

    if (data.frameId == frameId && data.save != "false")
        persistChange(data);
}

function broadcastChange(data) {
    message.send({
        broadcastSender: false,
        broadcastBrowser: true,
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
        method: 'update.object',
        array: 'crdt-transactions',
        object: {
            _id: data.object,
            docName,
            changeLog,
            text,
            crud: {
                array: data.array,
                object: data.object,
                key: data.key
            }
        },
        upsert: true,
        namespace: data.namespace,
        room: data.room,
        broadcast: data.broadcast,
        broadcastSender: data.broadcastSender,
        broadcastBrowser: false,
        metadata: 'crdt-change'
    }

    crud.send(Data);
}

message.listen('crdt', function (response) {
    let data = response.data
    let docName = getDocName(data);
    let doc = docs.get(docName);

    if (doc) {
        if (data.frameId !== frameId) {
            insertChange(data);
        }
    }
});

crud.listen('update.object', (data) => sync(data))
crud.listen('delete.object', (data) => sync(data))

function sync(data) {
    if (data.frameId === frameId)
        return
    if (data.array.includes('crdt-transactions')) {
        if (data.object && data.object[0]) {
            let Data = data.object[0];
            let docName = Data.docName;
            let doc = docs.get(docName);
            if (doc && Data.crud) {
                // let text = doc.get('text')
                // if (!text && text !== '') {
                //     setTimeout(function () {
                //         console.log("text empty timout set");
                //         sync(data)
                //     }, 1000); // Delayed action after 2 seconds
                // } else {
                Data.crud.value = Data.text
                Data.crud.start = 0
                Data.crud.length = doc.get('text').length

                doc.set('changeLog', Data.changeLog)
                doc.set('text', Data.text)
                // TODO: compare modified dates to check if arrays need to merged and orderd by date or if we just use server
                localChange(Data.crud, Data.text)
                console.log('crdtSync')
                // }
            }
        }
    }

}

/*
crdt.getText({
    array: 'modules',
    object: '5e4802ce3ed96d38e71fc7e5',
    key: 'name'
})
*/
async function getText(data) {
    try {
        let doc = await getDoc(data);
        if (doc) {
            let value = doc.get('text')
            return value;
        } else {
            console.log('undefined')
        }
    } catch (e) {
        console.error(e);
        return "";
    }
}


/*
crdt.replaceText({
    array: "module",
    object: "",
    key: "",
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
    } catch (e) {
        console.error(e);
    }
}

/*
crdt.updateText({
    array: 'module_activities',
    object: '5e4802ce3ed96d38e71fc7e5',
    key: 'name',
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
            crud.send({
                method: 'update.object',
                array: data.array,
                object: {
                    _id: data.object,
                    [data.key]: wholestring
                },
                upsert: data.upsert,
                namespace: data.namespace,
                room: data.room,
                broadcast: data.broadcast,
                broadcastSender: false,
                broadcastBrowser: true,
                metadata: 'crdt-updateobject'
            });
        }
    }
}

function createChange(data, change) {
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
    data = { ...data, ...change };
    delete data.frameId
    delete data.datetime
    delete change.frameId
    delete change.datetime
    return { data, change }
}

function undoText(data) {
    let docName = getDocName(data);
    let doc = docs.get(docName);
    let changeLog = doc.get('changeLog');
    let undoLog = doc.get('undoLog')

    for (let index = changeLog.length - 1; index >= 0; index--) {
        let change = Object.assign({}, changeLog[index]);
        if (change && change.frameId == frameId) {
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

function redoText(data) {
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
            if (change || change !== null) {
                string = string.customSplice(change.start, change.length, change.value);
            }
        }
        return { ...data, ...string }
    } catch (e) {
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
    return `${data.array}${data.object}${data.key}`;
}

export default { init, getText, updateText, replaceText, undoText, redoText, viewVersion };
