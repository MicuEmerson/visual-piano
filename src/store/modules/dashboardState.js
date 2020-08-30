export default {
    namespaced: true,

    state: {
        showConfig : false,
        startOctave: 2,
        endOctave: 4,
        editKeys : false,
        showKeys : false,
        showNotes: false,
        playing: false,
        allOctaves:[0, 1, 2, 3, 4, 5, 6],
    },

    mutations: {
        SET_SHOW_CONFIG(state, showConfig){
            state.showConfig = showConfig;
        },
        SET_START_OCTAVE(state, startOctave){
            state.startOctave = startOctave;
        },
        SET_END_OCTAVE(state, endOctave){
            state.endOctave = endOctave;
        },
        SET_EDIT_KEYS(state, editKeys){
            state.editKeys = editKeys;
        },
        SET_SHOW_KEYS(state, showKeys){
            state.showKeys = showKeys;
        },
        SET_SHOW_NOTES(state, showNotes){
            state.showNotes = showNotes;
        },
        SET_IS_MOUSE_PRESSED(state, isMousePressed){
            state.isMousePressed = isMousePressed;
        },
        SET_PLAYING(state, playing){
            state.playing = playing;
        },
    },

    actions: {
        changeStartOctave({ commit, dispatch }, startOctave){
            commit("SET_START_OCTAVE", startOctave);
            dispatch("keyboardState/generateNotes", {}, {root:true});
        }, 

        changeEndOctave({ commit, dispatch}, endOctave){
            commit("SET_END_OCTAVE", endOctave);
            dispatch("keyboardState/generateNotes", {}, {root:true});
        }
    },
    
    getters: {
      
    },
}