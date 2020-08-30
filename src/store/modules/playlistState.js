import { Midi } from "@tonejs/midi"

export default {
    namespaced: true,

    state: {
       songs:[
           {name : "Bach - 1", fromPlaylist: true },
           {name : "Bach - 2", fromPlaylist: true },
           {name : "Beyonce - Halo", fromPlaylist: true },
           {name : "Linking Park - Crawling", fromPlaylist: true },
           {name : "Yiruma- River Flows In You", fromPlaylist: true }
        ],
       currentSong: "",
    },

    mutations: {
       SET_CURRENT_SONG(state, val){
           state.currentSong = val;
       },
       ADD_NEW_RECORDED_SONG(state, val){
           state.songs.unshift(val);
       }
    },

    actions: {
        changeSong({commit, dispatch}, currentSong){
            commit("SET_CURRENT_SONG", currentSong);
            dispatch("prepareSong");
        },

        prepareNotes({state, rootState, commit}, notes) {
            notes.forEach(note => {
                rootState.toneState.tone.Transport.schedule(() => {
                  if(state.currentSong.fromPlaylist){
                    rootState.toneState.sampler.triggerAttackRelease(note.name, note.duration, rootState.toneState.tone.now(), note.velocity);
                  } else {
                    rootState.toneState.sampler.triggerAttackRelease(note.name, "2n", rootState.toneState.tone.now());
                  }
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
                        commit("keyboardState/SET_NOTE_PRESSED", {index, forBlackNote, pressed : true}, {root:true});
                  }, time)
                }, note.time)
      
                rootState.toneState.tone.Transport.schedule(time => {
                    rootState.toneState.tone.Draw.schedule(() => {
                        commit("keyboardState/SET_NOTE_PRESSED", {index, forBlackNote, pressed : false}, {root:true});
                  }, time)
                }, note.time + note.duration)
      
            })
        },

        prepareSong({state, dispatch}){
            if(state.currentSong.fromPlaylist){
                Midi.fromUrl("/audio/" + state.currentSong.name + ".mid").then(midi => {
                    midi.tracks.forEach(track => dispatch("prepareNotes", track.notes));
                });  
            } else {
                dispatch("prepareNotes", state.currentSong.notes)
            }

            // Midi.fromUrl("/audio/" + state.currentSong.name + ".mid").then(midi => {
            //     midi.tracks.forEach(track => {
            //         track.notes.forEach(note => {
            //          rootState.toneState.tone.Transport.schedule(() => {
            //             rootState.toneState.sampler.triggerAttackRelease(note.name, note.duration, rootState.toneState.tone.now(), note.velocity);
            //           }, note.time)
            
            //           let index = null;
            //           let forBlackNote = false;
            //           console.log("pregatim...");
            //           for (let i = 0; i < rootState.keyboardState.notes.length; i++) {
            //               if(rootState.keyboardState.notes[i].note === note.name){
            //                 index = i;
            //                 break;
            //               } 
            //               else if(rootState.keyboardState.notes[i].blackNote && rootState.keyboardState.notes[i].blackNote.note === note.name){
            //                 index = i;
            //                 forBlackNote = true;
            //                 break;
            //               }
            //           }
                                  
            //         if(index != null) {
            //             rootState.toneState.tone.Transport.schedule(time => {
            //                 rootState.toneState.tone.Draw.schedule(() => {
            //                     commit("keyboardState/SET_NOTE_PRESSED", {index, forBlackNote, pressed : true}, {root:true});
            //                 }, time)
            //             }, note.time)
                
            //             rootState.toneState.tone.Transport.schedule(time => {
            //                 rootState.toneState.tone.Draw.schedule(() => {
            //                     commit("keyboardState/SET_NOTE_PRESSED", {index, forBlackNote, pressed : false}, {root:true});
            //                 }, time)
            //             }, note.time + note.duration)
            //         }

            //         })
            //     })
            // })
       

        },
    }
    
    
}