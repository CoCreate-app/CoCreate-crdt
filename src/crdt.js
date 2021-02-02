import CoCreateYSocket from "./core.js"
import * as Y from 'yjs'


class CoCreateCRDTClass extends CoCreateYSocket 
{
  constructor(org, doc) {
    super(org, doc)
  }

  /*
  CoCreate.initDataCrdt({
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
      console.log("InitCrdt")
    } catch(e) {
      console.log('Invalid param', e);
    }
  }

  /*. init data function
  CoCreate.replaceDataCrdt({
    collection: "module",
    document_id: "",
    name: "",
    value: "",
    update_crud: true | false,
    element: dom_object,
    metadata: "xxxx"
  })
  */
  
  replace(info){
    if (!info) return;

    const id = this.__getYDocId(info.collection, info.document_id, info.name)
    if (!id) return;
    if (info.update_crud || !this.getType(id) ) {
      CoCreate.crdt.updateDocument({
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
    } else {
      let oldData = this.getType(id).toString();
      this.deleteData(id, 0, Math.max(oldData.length, info.value.length));
      this.insertData(id, 0, info.value);
    }
  }
  
  /*
  CoCreate.insertDataCrdt({
  	collection: 'module_activities',
  	document_id: '5e4802ce3ed96d38e71fc7e5',
  	name: 'name',
  	value: 'T',
  	position:'8
  	attributes: {bold: true}
  })
  */
  insert (info) {
      try {
        this.__validateKeysJson(info,['collection','document_id','name','value','position']);
        let id = this.__getYDocId(info['collection'], info['document_id'], info['name'])
        if (id) {
          this.insertData(id, info['position'], info['value'], info['attributes']);
        }
      }
      catch (e) {
         console.error(e); 
      }
  }
  
  
  /*
  CoCreate.delete({
  	collection: 'module_activities',
  	document_id: '5e4802ce3ed96d38e71fc7e5',
  	name: 'name',
  	position:8,
  	length:2,
  })
  */
  delete(info) {
    try{
      this.__validateKeysJson(info,['collection','document_id','name', 'position','length']);
      let id = this.__getYDocId(info['collection'], info['document_id'], info['name'])
      if (id) {
        this.deleteData(id, info['position'], info['length']);
      }
    }
    catch (e) {
       console.error(e); 
    }
  }
  
  
  /*
  CoCreate.getDataCrdt({
  	collection: 'module_activities',
  	document_id: '5e4802ce3ed96d38e71fc7e5',
  	name: 'name'
  })
  */
  get(info) {
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
  CoCreate.getPosition(function(data))
  CoCreate.getPosition(function(data){console.log(" EScuchando ahora  ",data)})
  */
  getPosition(callback){
   if(typeof miFuncion === 'function')
    this.changeListenAwereness(callback);
   else
    console.error('Callback should be a function')
  }
 
  __getYDocId(collection, document_id, name) {
    if (!CoCreate.utils.checkValue(collection) || 
        !CoCreate.utils.checkValue(document_id) || 
        !CoCreate.utils.checkValue(name)) 
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

const g_yDoc = new Y.Doc();
let CoCreateCrdt = new CoCreateCRDTClass(config.organization_Id, g_yDoc);

export default CoCreateCrdt;

