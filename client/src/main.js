<<<<<<< HEAD
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Vuetify from 'vuetify'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
=======
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
>>>>>>> 025f18e943d174b48e3fe0c7fddc60f7d0dc72f1
import Scrollspy from 'vue2-scrollspy';
import { createPinia, PiniaVuePlugin } from 'pinia';

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
Vue.use(VueAxios, axios)
Vue.use(Scrollspy);
Vue.use(Vuetify)

// Turn off productionTip Warning
Vue.config.productionTip = false

// Vue.prototype.$apiuri = "https://cms-docs-prod-cms-docs-hds0vk.mo2.mogenius.io"
// Vue.prototype.$apiuri = "https://cmsdocs-production.up.railway.app"
Vue.prototype.$apiuri = "http://localhost:3500"


new Vue({
  vuetify,
  pinia,
  router,
  render: h => h(App)
}).$mount('#app')

