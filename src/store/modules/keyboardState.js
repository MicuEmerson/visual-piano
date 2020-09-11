import CanvasMessage from "../../utils/CanvasMessages"

export default {
    namespaced: true,

    state: {
      notesIndexesByKey: {},
      notes : [],

      whiteNoteWidthSize: 0,
      isMousePressed: false,

      // 45 keys
      allKeys:[
        '`', `1`, '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
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
        SET_NOTE_KEY(state, { value, index, forBlackNote }){
          if(forBlackNote){
            state.notes[index].blackNote.key = value;
          } else {
            state.notes[index].key = value;
          }
        },
        ADD_NOTE(state, note){
            state.notes.push(note);
        },
        ADD_NEW_KEY_INDEX(state, { index, forBlackNote }){
          if(forBlackNote){
            state.notesIndexesByKey[state.notes[index].blackNote.key] = index;
          } else {
            state.notesIndexesByKey[state.notes[index].key] = index;
          }
        },
        UPDATE_INDEX_KEY(state, { key, index }){
            state.notesIndexesByKey[key] = index;
        }, 
        DELETE_INDEX_KEY(state, key){
          delete state.notesIndexesByKey[key];
        },
        CLEAR_PRESSED_KEYS(state) {
          for(let note of state.notes) {
            note.pressed = false;
            if(note.blackNote){
              note.blackNote.pressed = false;
            }
          }
        }
    },

    actions: {
      playNote({ commit, state, rootState }, { index, forBlackNote }) {
        const currentNote = forBlackNote ? state.notes[index].blackNote : state.notes[index];
        
        if(!currentNote.pressed && !rootState.dashboardState.editKeys) {
          rootState.toneState.sampler.triggerAttackRelease(currentNote.note, "2n");
          
          commit("SET_NOTE_PRESSED", { index, forBlackNote, pressed : true });

          if(rootState.recordingState.isRecording){
            commit("recordingState/ADD_RECORD_MAP", currentNote.note, {root:true});
          }

          rootState.canvasState.worker.postMessage({ messageType : CanvasMessage.START_DRAW_NOTE, 
            drawNote: {noteName: currentNote.note, forBlackNote}});
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

      removePressedKey({ state, commit, rootState }, { index, forBlackNote }) {
        const currentNote = forBlackNote ? state.notes[index].blackNote : state.notes[index];
        if(currentNote.pressed === true){
          commit("SET_NOTE_PRESSED", { index, forBlackNote, pressed : false });

          if(rootState.recordingState.isRecording){
            commit("recordingState/ADD_RECORD_MIDI", currentNote.note, {root:true});
          }

          rootState.canvasState.worker.postMessage({ messageType : CanvasMessage.STOP_DRAW_NOTE, 
            drawNote: {noteName: currentNote.note, forBlackNote}});
        }
      },

      removePressedKeyMouse({ commit, dispatch }, { index, forBlackNote }) {
        commit("SET_MOUSE_PRESSED", false);
        dispatch("removePressedKey", { index, forBlackNote });
      },

      changeInput({ commit }, {value, key, index, forBlackNote}) {
        commit("DELETE_INDEX_KEY", key);
        commit("SET_NOTE_KEY", {value, index, forBlackNote});
        commit("UPDATE_INDEX_KEY", {key, index})
      },

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
            commit("ADD_NEW_KEY_INDEX", { index, forBlackNote });
    
            if(state.notes[index].blackNote != undefined){
              forBlackNote = true;
              commit("ADD_NEW_KEY_INDEX", { index, forBlackNote });
            } 
          }
      },

    },
}