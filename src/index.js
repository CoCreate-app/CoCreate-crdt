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

import crud from '@cocreate/crud-client';
import { uuid, ulid, ulidDecode } from '@cocreate/utils';
import localStorage from '@cocreate/local-storage';

/**
 * @typedef {Object} CRDTData
 * @property {string} array - The collection/array name.
 * @property {string} object - The document/object ID.
 * @property {string} key - The specific key/field being edited.
 * @property {string} [value] - The string value being inserted or modified.
 * @property {number} [start] - The starting index of the change.
 * @property {number} [length] - The length of the text being modified.
 * @property {string} [frameId] - The browser frame origin ID.
 * @property {string} [id] - The unique ULID for the change.
 */

const objects = {};
const clientId = crud.socket.clientId || uuid(12);
const frameId = crud.socket.frameId || uuid(12);
const checkedDb = new Map();

/**
 * Pure helper function to replace String.prototype.customSplice.
 * Prevents global prototype pollution while allowing string mutation logic.
 * 
 * @param {string} str - The original string.
 * @param {number} index - The zero-based index at which to start changing the string.
 * @param {number} count - The number of characters to remove.
 * @param {string} [add=""] - The string to insert.
 * @returns {string} The modified string.
 * 
 * @example
 * spliceString("Hello World", 6, 5, "CRDT"); // Returns "Hello CRDT"
 */
function spliceString(str, index, count, add) {
    if (index < 0) {
        index = str.length + index;
        if (index < 0) index = 0;
    }
    return str.slice(0, index) + (add || "") + str.slice(index + Math.abs(count));
}

/**
 * Initializes a CRDT session for a specific document field.
 * Fetches the initial text state and sets the local frame context.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 */
function init(data) {
    getText(data).then(value => {
        data.value = value;
        data.start = 0;
        data['frameId'] = frameId;
        localChange(data);
    });
}

/**
 * Retrieves the internal CRDT tracking object for a specific field.
 * If it doesn't exist locally, it queries the database for the changelog.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 * @returns {Promise<Object|undefined>} The tracked object containing text and changelogs.
 */
async function getObject(data) {
    try {
        if (['_id', 'organization_id'].includes(data.key)) return;
        
        let name = getName(data);
        let object = objects[name];

        if (!object) {
            objects[name] = object = {};
        }

        // Initialize logs if this is the first time touching this object
        if (!object.changeLog) {
            let changeLog = [];
            object.undoLog = new Map();
            object.redoLog = new Map();

            if (data.read !== 'false') {
                if (!data.newObject) {
                    let response = await crud.send({
                        method: "object.read",
                        array: "crdt",
                        object: {
                            $filter: {
                                query: { name },
                                limit: 1
                            }
                        }
                    });
                    if (response.object && response.object[0] && response.object[0].changeLog) {
                        changeLog = response.object[0].changeLog;
                    }
                }
                object.changeLog = changeLog;
                
                if (!object.text) {
                    await generateText(data, true);
                }
            }
        } else if (!object.text) {
            await generateText(data, false);
        }
        return object;
    } catch (e) {
        console.log('Invalid param', e);
    }
}

/**
 * Rebuilds the current text state from the changeLog.
 * Now mathematically guaranteed by ULID chronological sorting.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 * @param {boolean} flag - Whether to fetch from DB if empty.
 * @returns {Promise<string>} The rebuilt text string.
 */
async function generateText(data, flag) {
    try {
        let name = getName(data);
        let object = objects[name];
        object['text'] = '';
        
        // Guarantee the changelog is in perfect temporal order before replaying.
        // ULIDs are lexicographically sortable, allowing us to perfectly sequence events.
        object['changeLog'].sort((a, b) => a.id.localeCompare(b.id));

        for (let change of object['changeLog']) {
            if (change) {
                if (change.type === 'snapshot') {
                    // Fast-forward: Skip rebuilding character-by-character and jump straight to the snapshot state
                    object['text'] = change.value;
                } else {
                    object['text'] = spliceString(object['text'], change.start, change.length, change.value);
                }
            }
        }

        if (object['text'] === '' && data.read !== 'false') {
            object['text'] = await checkDb(data, flag) || '';
        }

        return object['text'];
    } catch (e) {
        console.error(e);
    }
}

/**
 * Checks the database for the raw document value if no changelog is available.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 * @param {boolean|string} flag - Whether to insert the fetched text as a base change.
 * @returns {Promise<string>} The base text string.
 */
async function checkDb(data, flag) {
    let { array, object, key } = data;
    if (checkedDb.get(`${array}${object}${key}`)) return;
    
    checkedDb.set(`${array}${object}${key}`, true);

    let string = '';
    if (data.newObject) {
        string = data.newObject;
    } else {
        let response = await crud.send({ method: 'object.read', array, object: { _id: object, key } });
        string = crud.getValueFromObject(response.object[0], key);
    }

    if (string && typeof string !== 'string') string = "";
    
    // Seed the CRDT with the existing string from the database
    if (string && typeof string === 'string' && flag !== false) {
        data.value = string;
        data.start = 0;
        data.frameId = frameId;
        insertChange(data);
    }

    return string || '';
}

/**
 * The core Collaborative Editing Engine. 
 * Handles incoming characters, out-of-order resolution, and conflict management.
 * 
 * @param {CRDTData} data - The payload containing the keystroke/change.
 * @param {string} [flag] - Pass 'replace' to completely overwrite the changelog.
 * 
 * @example
 * insertChange({ array: "users", object: "123", key: "bio", value: "A", start: 0 });
 */
function insertChange(data, flag) {
    let name = getName(data);
    let object = objects[name];
    let changeLog = object.changeLog;
    
    if (!changeLog) return;

    object.text = object.text || '';

    let type = 'insert';
    if (data.start == undefined) return;
    if (!data.value) type = 'delete';

    // Core CRDT Change Object
    let change = {
        id: data.id || ulid(), 
        value: data.value || '',
        start: data.start,
        end: data.end,
        length: data.length || 0,
        clientId: data.clientId || clientId,
        frameId: data.frameId || frameId,
        user_id: data.user_id || localStorage.getItem("user_id"),
        type
    };

    if (!change || change == null) {
        console.log('null change');
        return;
    }

    // Store the removed value to enable undo functionality
    if (change.length > 0) {
        change.removedValue = object.text.substring(change.start, change.length);
    }

    if (flag === 'replace') {
        changeLog = [change];
        object.changeLog = changeLog;
        object.text = spliceString("", change.start, change.length, change.value);
    } else {
        // SECURITY / STALE CHECK: Ensure the incoming change isn't older than a snapshot
        let firstChange = changeLog[0];
        if (firstChange && firstChange.type === 'snapshot') {
            let changeTime = ulidDecode(change.id);
            let snapshotTime = ulidDecode(firstChange.id);
            
            if (changeTime < snapshotTime) {
                console.warn(`Rejected stale edit: User's change is older than the current snapshot boundary.`);
                if (!data.frameId || data.frameId === frameId) {
                   // Force a local sync/refresh to the latest state
                   localChange(data, object.text);
                }
                return; // Abort insertion
            }
        }

        let lastChange = changeLog[changeLog.length - 1];
        changeLog.push(change);
        
        data.frameId = change.frameId;
        broadcastChange(data);

        // Conflict Resolution: Fast path vs Rebuild
        if (!lastChange || change.id >= lastChange.id) {
            // In-order delivery: apply change directly to string for high performance
            object.text = spliceString(object.text, change.start, change.length, change.value);
            localChange(data, object.text);
        } else {
            // Out-of-order delivery: rebuild the text mathematically from the log
            generateText(data, false).then(text => {
                localChange(data, text);
            });
        }
    }

    if (data.frameId === frameId && data.save !== "false") {
        persistChange(data, change);
    }
}

/**
 * Broadcasts a local change to other connected browser clients via WebSocket.
 * 
 * @param {CRDTData} data - The change payload.
 */
function broadcastChange(data) {
    crud.socket.send({
        method: "crdt",
        broadcastSender: false,
        broadcastBrowser: true,
        data
    });
}

/**
 * Dispatches a DOM event to update the local UI (e.g., input fields, textareas).
 * 
 * @param {CRDTData} data - The change payload.
 * @param {string} string - The newly calculated full text string.
 */
function localChange(data, string) {
    const localChange = new CustomEvent('cocreate-crdt-update', {
        detail: { ...data, string },
    });
    window.dispatchEvent(localChange);
}

/**
 * Saves the changeLog operation to the backend database for permanent storage.
 * 
 * @param {CRDTData} data - The change payload.
 * @param {Object} change - The generated ULID change object.
 */
function persistChange(data, change) {
    let name = getName(data);
    let Data = {
        method: 'object.update',
        array: 'crdt',
        object: {
            name,
            '$push.changeLog': change,
            crud: {
                array: data.array,
                object: data.object,
                key: data.key
            }
        },
        $filter: {
            query: { name },
            limit: 1
        },
        upsert: true,
        namespace: data.namespace,
        room: data.room,
        broadcast: data.broadcast,
        broadcastSender: data.broadcastSender,
        broadcastBrowser: false,
        metadata: 'crdt-change'
    };

    crud.send(Data);
}

// WebSocket listener for incoming remote CRDT changes
crud.socket.listen('crdt', function (response) {
    let data = response.data;
    let name = getName(data);
    let object = objects[name];

    if (object) {
        // Only insert if it originated from a different frame/browser
        if (data.frameId !== frameId) {
            insertChange(data);
        }
    }
});

/**
 * Syncs entire CRDT states from a remote source, often used for initial connection.
 * 
 * @param {Object} data - The sync payload from the server.
 */
function sync(data) {
    if (data.clientId === clientId) return;
    
    if (data.array.includes('crdt')) {
        if (data.object && data.object[0]) {
            let Data = data.object[0];
            let name = Data.name;
            let object = objects[name];
            
            if (object && Data.crud) {
                Data.crud.value = Data.text;
                Data.crud.start = 0;
                Data.crud.length = object['text'].length;

                object['changeLog'] = Data.changeLog;
                object['text'] = Data.text; 
                
                localChange(Data.crud, Data.text);
                console.log('crdtSync');
            }
        }
    }
}

/**
 * Helper to fetch the current full text of a tracked field.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 * @returns {Promise<string>} The current text value.
 */
async function getText(data) {
    try {
        let object = await getObject(data);
        if (object) {
            return object.text;
        } else {
            console.log('undefined');
        }
    } catch (e) {
        console.error(e);
        return "";
    }
}

/**
 * Replaces the entire contents of the text state with a new string.
 * Used for copy/paste or programmatic overwrites.
 * 
 * @param {CRDTData} data - Payload containing the new replacement string.
 */
async function replaceText(data) {
    try {
        let object = await getObject(data);
        if (object) {
            let oldValue = await getText(data);
            if (oldValue) {
                data.length = oldValue.length;
            } else {
                data.length = 0;
            }

            data.start = 0;
            updateText(data, 'replace');
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * Wraps insertChange and additionally broadcasts a standard object update 
 * for systems not listening to raw CRDT streams.
 * 
 * @param {CRDTData} data - The change payload.
 * @param {string} [flag] - Flag to pass to insertChange (e.g., 'replace').
 */
async function updateText(data, flag) {
    let object = await getObject(data);
    if (object) {
        insertChange(data, flag);

        if (data.crud !== 'false' && data.save !== 'false') {
            if (data.upsert === undefined) data.upsert = true;
            
            let wholestring = await getText(data);
            crud.send({
                method: 'object.update',
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

/**
 * Inverts an operation to facilitate undo functionality.
 * A deletion becomes an insertion, and an insertion becomes a deletion.
 * 
 * @param {CRDTData} data - The data context.
 * @param {Object} change - The change object to invert.
 * @returns {Object} An object containing the inverted data and change payloads.
 */
function createChange(data, change) {
    if (change.value && change.length == 0) {
        change.length = change.value.length;
        change.removedValue = change.value;
        change.value = '';
        change.type = 'delete';
    } else {
        change.value = change.removedValue;
        change.length = 0;
        change.type = 'insert';
    }
    
    data = { ...data, ...change };
    delete data.frameId;
    delete data.id; // Strip ULID so a fresh one is generated for the undo action
    delete change.frameId;
    delete change.id;
    return { data, change };
}

/**
 * Reverts the last local change made by the user.
 * Skips remote changes originating from other users.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 */
function undoText(data) {
    let name = getName(data);
    let object = objects[name];
    let changeLog = object.changeLog;
    let undoLog = object.undoLog;

    // Traverse changelog backwards to find the last local frame modification
    for (let index = changeLog.length - 1; index >= 0; index--) {
        let change = Object.assign({}, changeLog[index]);
        if (change && change.frameId == frameId) {
            let log = undoLog.get(index);
            if (!log) {
                if (log != 'undo') {
                    undoLog.set(index, 'undo');
                    change.index = changeLog.length += 1;
                    let updated = createChange(data, change);
                    undoLog.set(updated.change.index, updated.change);
                    updateText(updated.data);
                    return;
                }
            }
        }
    }
}

/**
 * Re-applies a previously undone local change.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 */
function redoText(data) {
    let name = getName(data);
    let object = objects[name];
    let redoLog = object.redoLog;
    let undoLog = Array.from(object.undoLog.values());

    for (let index = undoLog.length - 1; index >= 0; index--) {
        let change = Object.assign({}, undoLog[index]);
        if (change && change != 'undo') {
            let log = redoLog.get(change.index);

            if (!log) {
                if (log != 'redo') {
                    let updated = createChange(data, change);
                    redoLog.set(updated.change.index, updated.change);
                    updateText(updated.data);
                    return;
                }
            }
        }
    }
}

/**
 * Reconstructs the document state up to a specific historical version index.
 * Useful for time-travel debugging and version history viewing.
 * 
 * @param {CRDTData} data - Contains version number target.
 * @returns {Promise<Object>} The rebuilt document state at that point in time.
 */
async function viewVersion(data) {
    try {
        let name = getName(data);
        let object = objects[name];
        let changeLog = object.changeLog;
        let string = '';

        let sortedLog = [...changeLog].sort((a, b) => a.id.localeCompare(b.id));
        
        // If a version is explicitly requested, slice the log up to that point
        let log = data.version !== undefined ? sortedLog.slice(0, data.version) : sortedLog;
        
        for (let change of log) {
            if (change || change !== null) {
                if (change.type === 'snapshot') {
                    string = change.value;
                } else {
                    string = spliceString(string, change.start, change.length, change.value);
                }
            }
        }
        
        data.value = string;
        return data;
    } catch (e) {
        console.error(e);
    }
}

/**
 * Intelligent Garbage Collection & Log Compaction (Watermark Strategy).
 * Compresses history safely by respecting active users' last known states,
 * falling back to a time limit for inactive users.
 * 
 * @param {CRDTData} data - The document tracking configuration.
 * @param {number} [countThreshold=5000] - Minimum log size before triggering snapshot.
 * @param {number} [timeGracePeriodMs=604800000] - 7 days in ms. Older offline users lose their anchor.
 * @returns {Promise<Array|undefined>} The newly compressed changelog.
 */
async function createSnapshot(data, countThreshold = 5000, timeGracePeriodMs = 7 * 24 * 60 * 60 * 1000) {
    let name = getName(data);
    let object = objects[name];
    
    // Only compress if the log is large enough to warrant it
    if (!object || !object.changeLog || object.changeLog.length < countThreshold) return;

    object.changeLog.sort((a, b) => a.id.localeCompare(b.id));

    const now = Date.now();
    const latestUserChanges = new Map();

    // 1. Find the high-water mark (latest change) for each unique user
    for (let i = 0; i < object.changeLog.length; i++) {
        let change = object.changeLog[i];
        if (change && change.type !== 'snapshot') {
            let identifier = change.user_id || change.clientId || 'system';
            // Overwrites previous entries, leaving only the very last known index per user
            latestUserChanges.set(identifier, { index: i, timestamp: ulidDecode(change.id) });
        }
    }

    // 2. Determine the safe boundary for compression.
    let safeCompressionIndex = object.changeLog.length - 1; 

    for (const [userId, record] of latestUserChanges.entries()) {
        let isStale = (now - record.timestamp) > timeGracePeriodMs;
        if (!isStale) {
            // User is active! We must protect their last known anchor point.
            if (record.index < safeCompressionIndex) {
                safeCompressionIndex = record.index;
            }
        }
    }

    if (safeCompressionIndex <= 0) return;

    // 3. Split the log at the safe boundary
    let logToCompress = object.changeLog.slice(0, safeCompressionIndex);
    let retainedLog = object.changeLog.slice(safeCompressionIndex);

    // Roll up the compressed section into a single string
    let snapshotText = '';
    for (let change of logToCompress) {
        if (change) {
            if (change.type === 'snapshot') {
                snapshotText = change.value;
            } else {
                snapshotText = spliceString(snapshotText, change.start, change.length, change.value);
            }
        }
    }

    // 4. Create the new snapshot event, adopting the exact ID of the last compressed item
    let lastCompressedChange = logToCompress[logToCompress.length - 1];
    let snapshotChange = {
        id: lastCompressedChange.id, // Inherit the ULID timestamp of the boundary
        type: 'snapshot',
        value: snapshotText,
        start: 0,
        length: 0, 
        clientId,
        frameId,
        user_id: localStorage.getItem("user_id") || "system",
        version: true // Flag to indicate this is a restorable state view
    };

    object.changeLog = [snapshotChange, ...retainedLog];

    // 5. Persist the newly compressed array to the database
    if (data.save !== "false") {
        crud.send({
            method: 'object.update',
            array: 'crdt',
            object: {
                name,
                changeLog: object.changeLog, 
                crud: { array: data.array, object: data.object, key: data.key }
            },
            $filter: { query: { name }, limit: 1 },
            upsert: true,
            metadata: 'crdt-snapshot'
        });
    }
    
    return object.changeLog;
}

/**
 * Helper to generate a unique string key representing a specific tracked document field.
 * 
 * @param {CRDTData} data - The routing payload.
 * @returns {string} Concatenated namespace/document/key string.
 */
function getName(data) {
    return `${data.array}${data.object}${data.key}`;
}

export default { init, objects, getName, getText, updateText, replaceText, undoText, redoText, viewVersion, createSnapshot };