import Vue from 'vue'
import Vuex from 'vuex'

import dashboardState from '@/store/modules/dashboardState.js'
import keyboardState from '@/store/modules/keyboardState.js'
import toneState from '@/store/modules/toneState.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    keyboardState,
    dashboardState,
    toneState
    // configuration,
    // recording,
    // playlist,
  },
  state: {},
})
