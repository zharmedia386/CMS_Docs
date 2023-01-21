import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

// Vue.prototype.$apiuri = "https://cms-docs-prod-cms-docs-hds0vk.mo2.mogenius.io"
Vue.prototype.$apiuri = "https://cmsdocs-production.up.railway.app"

// Vue.prototype.$apiuri = "http://localhost:3500"


new Vue({
  vuetify,
  pinia,
  router,
  render: h => h(App)
}).$mount('#app')

