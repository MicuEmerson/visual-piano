import Vue from 'vue'
import Vuex from 'vuex'

import menuState from '@/store/modules/menuState.js'
import keyboardState from '@/store/modules/keyboardState.js'
import toneState from '@/store/modules/toneState.js'
import recordingState from '@/store/modules/recordingState.js'
import playlistState from '@/store/modules/playlistState.js'
import canvasState from '@/store/modules/canvasState.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    keyboardState,
    menuState,
    toneState,
    recordingState,
    playlistState,
    canvasState
  },
})
