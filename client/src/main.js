import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
// import VueAxios from 'vue-axios';
import Scrollspy from 'vue2-scrollspy';
import VueTour from 'vue-tour'
import { createPinia, PiniaVuePlugin } from 'pinia';
import './config/axiosInterceptor';

require('vue-tour/dist/vue-tour.css')

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
// Vue.use(VueAxios, axios)
Vue.use(Scrollspy);
Vue.use(require('vue-moment'));
Vue.use(VueTour);

// Turn off productionTip Warning
Vue.config.productionTip = false

// Vue.prototype.$apiuri = "https://cms-docs-prod-cms-docs-hds0vk.mo2.mogenius.io"
// Vue.prototype.$apiuri = "https://cmsdocs-production.up.railway.app"
// Vue.prototype.$apiuri = "http://localhost:3500"
Vue.prototype.$apiuri = "https://cms-docs-prod-cms-docs-hds0vk.mo2.mogenius.io"


new Vue({
  vuetify,
  pinia,
  router,
  render: h => h(App)
}).$mount('#app')

