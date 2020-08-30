import Vue from 'vue'
import Vuex from 'vuex'

import dashboardState from '@/store/modules/dashboardState.js'
import keyboardState from '@/store/modules/keyboardState.js'
import toneState from '@/store/modules/toneState.js'
import recordingState from '@/store/modules/recordingState.js'
import playlistState from '@/store/modules/playlistState.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    keyboardState,
    dashboardState,
    toneState,
    recordingState,
    playlistState
  },
  state: {},
})
