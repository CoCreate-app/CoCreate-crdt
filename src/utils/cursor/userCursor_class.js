"use strict";
/* eslint-env browser */
// @ts-ignore

import { userColor } from './usercolor.js'

export class UserCursor {
    
    constructor(provider) {
      this.awareness = provider.awareness;
      this.debug = false;
      //console.log(" awareness",provider)
     this.__init();
    }
    
    __init(){
          
          var cursor_user = localStorage.getItem('cursor_user')
          if(this.debug)
            console.log(" INIT cursor_user = ",cursor_user)
          var user_id = localStorage.getItem('user_id')
          if (cursor_user == null){
            var uuid = this.generateUUID(4)
            let cursor_user = 'User : ' + uuid;
            localStorage.setItem('cursor_user',cursor_user)
            if(this.debug)
              console.log("update name From __init__USERCURSORQUILL "+cursor_user)
            this.updateAwarenessFromLocalstorage()
          }
          
          addEventListener('storage', this.updateAwarenessFromLocalstorage)
          
          this.awareness.setLocalStateField('user', {
            name: localStorage.getItem('cursor_user') || 'Anonymous',
            color: userColor.color,
            colorLight: userColor.light
          })
    }
    
    updateAwarenessFromLocalstorage(){
      const localstorageUsername = localStorage.getItem('cursor_user')
      if(this.debug)
        console.log(" from localStorage ",localstorageUsername)
      const awarenessState = this.awareness.getLocalState()
      if(this.debug)
        console.log(awarenessState)
      if(awarenessState != null && typeof(awarenessState.user.name)=='undefined' ){
        this.awareness.setLocalStateField('user', {
          name:  'Anonymous',
          color: userColor.color,
          colorLight: userColor.light
        })
      }
      if (localstorageUsername != null && awarenessState !== null && localstorageUsername !== awarenessState.user.name) {
        this.awareness.setLocalStateField('user', {
          name: localstorageUsername || 'Anonymous',
          color: userColor.color,
          colorLight: userColor.light
        })
      }
    }
    
    generateUUID(length=null) {
      var d = new Date().getTime();
      var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16;
          if(d > 0){
              var r = (d + r)%16 | 0;
              d = Math.floor(d/16);
          } else {
              var r = (d2 + r)%16 | 0;
              d2 = Math.floor(d2/16);
          }
          return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      if(length!=null){
        uuid = uuid.substr(0,length)
      }
      return uuid;
  }
}//en class




