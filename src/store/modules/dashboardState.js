import { PlayingState } from "../../utils/PlayingState";

export default {
    namespaced: true,

    state: {
        showConfig : false,
        octaves: [2, 6],
        maxEndOctave: 8,
        editKeys : false,
        showKeys : false,
        showNotes: false,
        playing: PlayingState.STOP,
        whiteNoteColor: "#1eb7eb",
        blackNoteColor: "#f9bb2d",
        sustain: true,
        volume: 100,
        speed: 100,
        defaultSpeed: 100
    },

    mutations: {
        SET_SHOW_CONFIG(state, showConfig){
            state.showConfig = showConfig;
        },
        SET_OCTAVES(state, octaves){
            state.octaves = octaves[0] > octaves[1] ? octaves.reverse() : octaves;
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
        SET_WHITE_NOTE_COLOR(state, color){
            state.whiteNoteColor = color;
        },
        SET_BLACK_NOTE_COLOR(state, color){
            state.blackNoteColor = color;
        },
        SET_SUSTAIN(state, sustain){
            state.sustain = sustain;
        },
        SET_VOLUME(state, volume){
            state.volume = volume;
        },
        SET_SPEED(state, speed){
            state.speed = speed;
        }
    },

    actions: {
        changeOctaves({ commit, dispatch }, octaves){
            commit("SET_OCTAVES", octaves);
            dispatch("keyboardState/generateNotes", {}, {root:true});
            dispatch("keyboardState/generateNotesIndexesByKey", {}, {root:true});
        }, 

        changeVolume({ commit, rootState }, volume) {
            commit("SET_VOLUME", volume);
            if (volume === 0) {
                rootState.toneState.sampler.volume.value = -1000;
            }
            else {
                rootState.toneState.sampler.volume.value = volume * 0.3 - 30;
            }
        },

        changeSpeed({ commit, rootState }, speed) {
            commit("SET_SPEED", speed);
            rootState.toneState.tone.Transport.bpm.value = speed * 1.2;
        },

        setPlaying({ commit, dispatch }, playing){
            if(playing === PlayingState.PAUSE){
                dispatch("playlistState/pauseTimers", {}, {root:true});
            } else {
                dispatch("playlistState/resumeTimers", {}, {root:true});
            }

            dispatch("canvasState/pauseOrResumeSong", playing, {root:true});
            commit("SET_PLAYING", playing);
        },

        stopPlaying({ commit, dispatch, state, rootState }){
            dispatch("canvasState/stopSong", {}, {root:true});
            commit("SET_PLAYING", PlayingState.STOP);

            commit("SET_SPEED", state.defaultSpeed);
            rootState.toneState.tone.Transport.bpm.value = state.defaultSpeed * 1.2;
        },

        whiteNoteColorChanged({ state, commit, dispatch }, color){
            commit("SET_WHITE_NOTE_COLOR", color);
            dispatch("canvasState/changeNoteColors", { whiteNoteColor: state.whiteNoteColor, blackNoteColor : state.blackNoteColor }, {root:true});
        },

        blackNoteColorChanged({ state, commit, dispatch }, color){
            commit("SET_BLACK_NOTE_COLOR", color);
            dispatch("canvasState/changeNoteColors", { whiteNoteColor: state.whiteNoteColor, blackNoteColor : state.blackNoteColor }, {root:true});
        },
    },
}