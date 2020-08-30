export default {
    namespaced: true,

    state: {
       // RECORDING STUFF
       recorder: new MediaRecorder(dest.stream),
       recordedChunks: [],
       recordedMap: {},
       recordedArray: [],
       startRecordTime: 0,
       endRecordTime: 0,
       isRecording: false,
       songUrlName : "bach_846.mid",     
    },

    mutations: {
        
    },

    actions: {
        
    }
}