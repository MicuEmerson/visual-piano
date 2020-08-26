import Vue from 'vue'
import Vuex from 'vuex'

import dashboardState from '@/store/modules/dashboardState.js'
import keyboardState from '@/store/modules/keyboardState.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    keyboardState,
    dashboardState,
    // configuration,
    // recording,
    // playlist,
  },
  state: {},
})
