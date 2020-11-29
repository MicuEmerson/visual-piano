import Vue from 'vue'
import Piano from './Piano.vue'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(Piano)
}).$mount('#app')
