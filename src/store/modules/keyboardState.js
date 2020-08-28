export default {
    namespaced: true,

    state: {
      notesIndexesByKey: {},
      notes : [],

      whiteNoteWidthSize: 0,
      isMousePressed: false,

      // 46 keys
      allKeys:[
        '`', `1`, '2', '3', '4', '5', '6', '7', '8', '9', '10', '0', '-', '=',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';',
        'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'
      ],

      allNotes:['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    },

    mutations: {
        CLEAR_NOTES_ARRAY(state){
            state.notes.length = 0;
        },
        CLEAR_NOTES_INDICES_ARRAY(state){
            state.notesIndexesByKey.length = 0;
        },
        SET_WHITE_NOTE_WIDTH_SIZE(state, size){
            state.whiteNoteWidthSize = size;
        },
        SET_NOTE_PRESSED(state, { index, forBlackNote, pressed }){
          if(forBlackNote){
            state.notes[index].blackNote.pressed = pressed;
          } else {
            state.notes[index].pressed = pressed;
          }
        },
        SET_MOUSE_PRESSED(state, value){
          state.isMousePressed = value;
        },
        SET_NOTE_KEY(state, {value, index, forBlackNote}){
          if(forBlackNote){
            state.notes[index].blackNote.key = value;
          } else {
            state.notes[index].key = value;
          }
        },
        ADD_NOTE(state, note){
            state.notes.push(note);
        },
        ADD_NEW_INDEX_KEY(state, {index, forBlackNote}){
          if(forBlackNote){
            state.notesIndexesByKey[state.notes[index].blackNote.key] = index;
          } else {
            state.notesIndexesByKey[state.notes[index].key] = index;
          }
        },
        UPDATE_INDEX_KEY(state, {key, index}){
            state.notesIndexesByKey[key] = index;
        }, 
        DELETE_INDEX_KEY(state, key){
          delete state.notesIndexesByKey[key];
        },
    },

    actions: {

      generateNotes({ commit, state, rootState }) {
          commit("CLEAR_NOTES_ARRAY");
          let keyIndex = 0;
          let noteIndex = state.allNotes.indexOf('C'); // we always start with note C
          
          for(let octave = rootState.dashboardState.startOctave; octave <= rootState.dashboardState.endOctave; octave++) {
    
              while(noteIndex < state.allNotes.length) {
                const currentNote = state.allNotes[noteIndex];
    
                let newNote = {
                  note: currentNote + octave,
                  key: state.allKeys[keyIndex++],
                  pressed: false,
                }
    
                if(currentNote != 'B' && currentNote!= 'E') {
                  let blackNote = {
                    note: currentNote + '#' + octave,
                    key: state.allKeys[keyIndex++],
                    pressed: false,
                  }
    
                  newNote["blackNote"] = blackNote;
                }
              
                commit("ADD_NOTE", newNote);
    
                if(octave === rootState.dashboardState.endOctave && currentNote === 'B'){ // we always end with note B
                  break;
                }
    
                noteIndex++;
              }
              noteIndex = 0;
          }
    
          commit("SET_WHITE_NOTE_WIDTH_SIZE", 100 / state.notes.length);
        },

      generateNotesIndexesByKey({ commit, state }) {
          commit("CLEAR_NOTES_INDICES_ARRAY");
          
          for(let index = 0; index < state.notes.length; index++){
            let forBlackNote = false;  
            commit("ADD_NEW_INDEX_KEY", { index, forBlackNote });
    
            if(state.notes[index].blackNote != undefined){
              forBlackNote = true;
              commit("ADD_NEW_INDEX_KEY", { index, forBlackNote });
            } 
          }
        },

      playNote({ commit, state, rootState }, { index, forBlackNote }) {
        const currentNote = forBlackNote ? state.notes[index].blackNote : state.notes[index];
        
        if(!currentNote.pressed && !rootState.dashboardState.editKeys) {
          // this.sampler.triggerAttackRelease(currentNote.note, "2n");
          const pressed = true;
          commit("SET_NOTE_PRESSED", { index, forBlackNote, pressed });

          // if(this.isRecording){
          //   this.recordedMap[noteObject.note] = {
          //       noteName: noteObject.note,
          //       startTime: new Date().getTime(),
          //       endTime: null
          //   };
          // }
        }
      },

      playNoteMouse({ commit, dispatch }, { index, forBlackNote }) {
        commit("SET_MOUSE_PRESSED", true);
        dispatch("playNote", { index, forBlackNote });
      },
  
      playNoteHover({ state, dispatch }, { index, forBlackNote }) {
        if(state.isMousePressed){ 
          dispatch("playNote", { index, forBlackNote });
        }
      },

      removePressedKey({ commit }, { index, forBlackNote }) {
        const pressed = false;
        commit("SET_NOTE_PRESSED", { index, forBlackNote, pressed });
        
        // if(this.isRecording) {

        //   if(this.recordedMap[noteObject.note] != undefined) {
            
        //     const noteName = this.recordedMap[noteObject.note].noteName;
        //     const startTime = this.recordedMap[noteObject.note].startTime;
        //     const endTime = new Date().getTime();

        //     delete this.recordedMap[noteObject.note];

        //     this.recordedArray.push({ noteName, startTime, endTime });          
        //   }
        // }
      },

      removePressedKeyMouse({ commit, dispatch }, { index, forBlackNote }) {
        commit("SET_MOUSE_PRESSED", false);
        dispatch("removePressedKey", { index, forBlackNote });
      },

      changeInput({ commit }, {value, key, index, forBlackNote}) {
        console.log("AM INTRAT", value, key, index, forBlackNote);
        commit("DELETE_INDEX_KEY", key);
        // delete this.notesIndexesByKey[noteObject.key];

        commit("SET_NOTE_KEY", {value, index, forBlackNote});
        // noteObject.key = value;

        commit("UPDATE_INDEX_KEY", {key, index})
        // this.notesIndexesByKey[noteObject.key] = index;      
      }
    },
    
    getters: {
      
    },
}