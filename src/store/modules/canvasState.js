import CanvasMessage from "../../utils/CanvasMessages"

export default {
    namespaced: true,

    state: {
      worker: {}, // where offscreencanvas is draw
      canvasDataIndexesByNote: {},  // Here we have a map where the key is a note name (ex: C4, E#4, etc) 
                                    // And value is a pair (x, width)
                                    // x position in the browser of that note
                                    // width for overlapping notes (ex: when C4 and C#4 are pressed simultaneous when we need to prevent the overlapping color)
      canvasWhiteNoteWidth : 0,
      canvasBlackNoteWidth: 0,
      waterfallDelay: 0,
    },

    mutations: {
        SET_CANVAS_WHITE_NOTE_WIDTH(state, size){
            state.canvasWhiteNoteWidth = size;
        },
        SET_CANVAS_BLACK_NOTE_WIDTH(state, size){
            state.canvasBlackNoteWidth = size;
        },
        SET_WORKER(state, worker){
            state.worker = worker;
        },
        SET_CANVAS_HEIGHT(state, size){
            state.windowHeight = size;
        },
        SET_CANVAS_WIDTH(state, size){
            state.windowWidth = size;
        },
        SET_CANVAS_WATERFALL_DELAY(state, delay){
            state.waterfallDelay = delay;
        },
        CLEAR_CANVAS_INDICES_ARRAY(state){
            state.canvasDataIndexesByNote.length = 0;
        },
        ADD_CANVAS_NOTE_INDEX(state, {key, value}){
            state.canvasDataIndexesByNote[key] = value;
        },
    },

    actions: {
        initCanvas({ commit, state }, { offscreenCanvas, workerFile }){
            commit("SET_WORKER", new Worker(workerFile));
            state.worker.postMessage({ canvas: offscreenCanvas, messageType : CanvasMessage.INIT}, [offscreenCanvas]);
        },

        resizeCanvas({ commit, state }, { height, width, array, whiteWidth, blackWidth, waterfallDelay}){
            commit("SET_CANVAS_HEIGHT", height);
            commit("SET_CANVAS_WIDTH", width);
            commit("CLEAR_CANVAS_INDICES_ARRAY");

            for(let index = 0; index < array.length; index++){
                const key = array[index].getAttribute("data-note");
                const value = Math.floor(array[index].getBoundingClientRect().x);
                commit("ADD_CANVAS_NOTE_INDEX", { key, value })
            }
  
            commit("SET_CANVAS_WHITE_NOTE_WIDTH", whiteWidth);
            commit("SET_CANVAS_BLACK_NOTE_WIDTH", blackWidth);
            commit("SET_CANVAS_WATERFALL_DELAY", waterfallDelay);
  
            state.worker.postMessage({ 
                messageType : CanvasMessage.RESIZE, 
                resizeData : {
                    height: Math.floor(height), 
                    width: Math.floor(width), 
                    whiteWidth : Math.floor(whiteWidth), 
                    blackWidth: Math.floor(blackWidth), 
                    array : state.canvasDataIndexesByNote 
                }});
        },

        startDrawNote({state}, drawNote){
            state.worker.postMessage({ messageType : CanvasMessage.START_DRAW_NOTE, drawNote });
        },

        stopDrawNote({state}, drawNote){
            state.worker.postMessage({ messageType : CanvasMessage.STOP_DRAW_NOTE, drawNote });
        },

        pauseOrResumeSong({state}, playing){
            playing = playing ? 1 : 2;
            state.worker.postMessage({ messageType : CanvasMessage.PAUSE_SONG, playing});
        },

        stopSong({state}){
            state.worker.postMessage({ messageType : CanvasMessage.STOP_SONG, playing : 3});
        }
    }
}