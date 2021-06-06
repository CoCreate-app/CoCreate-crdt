"use strict";
/* eslint-env browser */
// @ts-ignore

import uuid from '@cocreate/uuid'
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
            var randomid = uuid.generate(4)
            let cursor_user = 'User : ' + randomid;
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
    
}
