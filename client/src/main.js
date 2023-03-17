import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Scrollspy from 'vue2-scrollspy';
import { createPinia, PiniaVuePlugin } from 'pinia';
import './config/axiosInterceptor';

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
Vue.use(VueAxios, axios)
Vue.use(Scrollspy);
Vue.use(require('vue-moment'));

// Turn off productionTip Warning
Vue.config.productionTip = false

Vue.prototype.$apiuri = "http://localhost:3500"


new Vue({
  vuetify,
  pinia,
  router,
  render: h => h(App)
}).$mount('#app')

