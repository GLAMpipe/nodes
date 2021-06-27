import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import LoadScript from 'vue-plugin-load-script'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(LoadScript)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
