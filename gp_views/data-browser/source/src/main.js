import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import LoadScript from 'vue-plugin-load-script'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(LoadScript)
Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  //mode: 'history',
  base: __dirname,
  routes: [
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
