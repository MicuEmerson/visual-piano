import CanvasMessage from "../../utils/CanvasMessages"

export default {
    namespaced: true,

    state: {
      worker: {}, // where offscreencanvas is draw
      canvasDataIndexesByNote: {},  //here we have a map where the key is a note name (ex: C4, E#4, etc) and value is the x position in the browser of that note
      canvasWhiteNoteWidth : 0,
      canvasBlackNoteWidth: 0,
      windowHeight: 0,
      windowWidth: 0,
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
        SET_WINDOW_HEIGHT(state, size){
            state.windowHeight = size;
        },
        SET_WINDOW_WIDTH(state, size){
            state.windowWidth = size;
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

        resizeCanvas({ commit, state }, { height, width, pianoHeight }){
            height = Math.floor(height - pianoHeight + 1);
            width = Math.floor(width);

            commit("SET_WINDOW_HEIGHT", height);
            commit("SET_WINDOW_WIDTH", width);

            state.worker.postMessage({ messageType : CanvasMessage.RESIZE, height, width});
        },


        setDrawingDataForCanvas({ commit, state }, { array, whiteWidth, blackWidth }){
            commit("CLEAR_CANVAS_INDICES_ARRAY");
    
            for(let index = 0; index < array.length; index++){
              const key = array[index].getAttribute("data-note");
              const value = Math.floor(array[index].getBoundingClientRect().x);
              commit("ADD_CANVAS_NOTE_INDEX", { key, value })
            }

            commit("SET_CANVAS_WHITE_NOTE_WIDTH", whiteWidth);
            commit("SET_CANVAS_BLACK_NOTE_WIDTH", blackWidth);

            state.worker.postMessage({ messageType : CanvasMessage.SET_DRAWING_DATA, 
                drawningData : { whiteWidth, blackWidth, array : state.canvasDataIndexesByNote }});
        },

        startDrawNote({state}, drawNote){
            state.worker.postMessage({ messageType : CanvasMessage.START_DRAW_NOTE, drawNote });
        },

        stopDrawNote({state}, drawNote){
            state.worker.postMessage({ messageType : CanvasMessage.STOP_DRAW_NOTE, drawNote });
        }

    }
    
    
}