import { Midi } from "@tonejs/midi"
import Timer  from "../../utils/SetTimeoutTimer"

export default {
    namespaced: true,

    state: {
       songs:[
           {name : "Beethoven - For Elise", fromPlaylist: true },
           {name : "Bach - Prelude in C Major", fromPlaylist: true },
           {name : "Chopin - Grande Valse Brillante", fromPlaylist: true },
           {name : "Mozart - Sonata No. 8", fromPlaylist: true },
           {name : "Schubert - Six Moments Musicaux", fromPlaylist: true},
           {name : "Sinding - Rustle of Spring", fromPlaylist: true },
        ],
       currentSong: "",
       timers : [],
    },

    mutations: {
       SET_CURRENT_SONG(state, val){
           state.currentSong = val;
       },
       ADD_NEW_RECORDED_SONG(state, val){
           state.songs.unshift(val);
       },
       ADD_TIMER(state, timer){
           state.timers.push(timer);
       },
       CLEAR_TIMERS(state){
           state.timers.length = 0;
       }
    },

    actions: {
        changeSong({commit, dispatch}, currentSong) {
            commit("SET_CURRENT_SONG", currentSong);
            if(currentSong != ""){
                dispatch("prepareSong");
            }
        },

        clearTimes({state, commit}){
            state.timers.forEach(timer => timer.pause());
            commit("CLEAR_TIMERS");
        },

        pauseTimers({state}){
            state.timers.forEach(timer => timer.pause());
        },

        resumeTimers({state}){
            state.timers.forEach(timer => timer.resume());
        },

        prepareNotes({state, rootState, commit, dispatch}, {notes, lastSong}) {
            notes.forEach((note, i) => {
                rootState.toneState.tone.Transport.schedule(() => {

                    commit("ADD_TIMER", new Timer(() => {
                        if(state.currentSong.fromPlaylist){
                            rootState.toneState.sampler.triggerAttackRelease(note.name, note.duration, rootState.toneState.tone.now(), note.velocity);
                        } else {
                            rootState.toneState.sampler.triggerAttackRelease(note.name, "2n", rootState.toneState.tone.now());
                        }
                    }, rootState.canvasState.waterfallDelay));
              
                }, note.time)
      
                let index = null;
                let forBlackNote = false;
                for (let i = 0; i < rootState.keyboardState.notes.length; i++) {
                    if(rootState.keyboardState.notes[i].note === note.name){
                      index = i;
                      break;
                    } 
                    else if(rootState.keyboardState.notes[i].blackNote && rootState.keyboardState.notes[i].blackNote.note === note.name){
                      index = i;
                      forBlackNote = true;
                      break;
                    }
                }
       
                rootState.toneState.tone.Transport.schedule(time => {
                    rootState.toneState.tone.Draw.schedule(() => {
                        if(index != null){
                            commit("ADD_TIMER", new Timer(() => {
                                commit("keyboardState/SET_NOTE_PRESSED", {index, forBlackNote, pressed : true}, {root:true});
                            }, rootState.canvasState.waterfallDelay));
                            
                            dispatch("canvasState/startDrawNote", {noteName : note.name, forBlackNote}, {root:true});
                        }
                  }, time)
                }, note.time)
      
                rootState.toneState.tone.Transport.schedule(time => {
                    rootState.toneState.tone.Draw.schedule(() => {
                        if(index != null){
                            commit("ADD_TIMER", new Timer(() => {
                                commit("keyboardState/SET_NOTE_PRESSED", {index, forBlackNote, pressed : false}, {root:true});
                                if(lastSong && i === notes.length - 1){
                                    dispatch("stopPlaying", "");
                                }
                            }, rootState.canvasState.waterfallDelay));

                            dispatch("canvasState/stopDrawNote", {noteName : note.name, forBlackNote}, {root:true});
                        }
                        
                  }, time)
                }, note.time + note.duration)
      
            })
        },

        prepareSong({state, dispatch}){
            if(state.currentSong.fromPlaylist){
                Midi.fromUrl("/audio/" + state.currentSong.name + ".mid").then(midi => {
                    midi.tracks.forEach((track, i) => dispatch("prepareNotes", {notes : track.notes, lastSong : midi.tracks.length == i + 1}));
                });  
            } else {
                dispatch("prepareNotes", {notes:state.currentSong.notes, lastSong : true})
            }
        },

        stopPlaying({dispatch, rootState, commit}, currentSong){
            rootState.toneState.tone.Transport.stop();
            rootState.toneState.tone.Transport.cancel();
            dispatch("changeSong", currentSong);
            dispatch("clearTimes");
            commit("keyboardState/CLEAR_PRESSED_KEYS", {}, {root:true});
            dispatch("dashboardState/stopPlaying", {}, {root:true});
        }
    }
    
    
}