import Vue from 'vue'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App.vue'
import router from './router'
import store from './store'
import socket from './js/socket'
import 'lib-flexible/flexible.js'
import posFix from 'vue_ios_fixed_postion_bug_fix'
import vuePicturePreview from 'vue-picture-preview'
import VConsole from 'vconsole/dist/vconsole.min.js'
import axios from './js/axios'
import os from './js/os'
import plus from 'vue-h5-plus'
import VueCookies from 'vue-cookies'
import sqlite from './js/sqlite'
import moment from 'moment'
Vue.use(sqlite)
Vue.use(VueCookies)
Vue.use(posFix)
Vue.use(plus)
Vue.use(vuePicturePreview)
Vue.use(Mint)
Vue.config.productionTip = false
window.isApp = os.plus
Vue.prototype.$url = 'http://www.qm11.co/'
Vue.prototype.$socket = socket
Vue.prototype.$vConsole = new VConsole()
Vue.prototype.$moment = moment
Vue.prototype.$axios = axios
Vue.prototype.$sqlite = sqlite
Vue.directive('time', {
  bind: function (el, binding) {
    el.innerHTML = moment(binding.value).format('MM-DD HH:mm')
  }
})
Vue.directive('datetime', {
  bind: function (el, binding) {
    el.innerHTML = moment(binding.value).format('MM-DD HH:mm:ss')
  }
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.getItem('token') !== null) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
