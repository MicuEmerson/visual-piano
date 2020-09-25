import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: { customProperties: true },
        themes: {
            light: {
                primary: '#111111',
                secondary: '#222222',
                text: '#dcdcdc',
                accent: '#ffb200',
            },
        },
      },
});
