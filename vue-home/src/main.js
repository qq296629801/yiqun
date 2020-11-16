// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import locale from 'iview/dist/locale/en-US' // Change locale, check node_modules/iview/dist/locale
import { post, get, deleteData, download, put, formData, formDataType2 } from './js/request'
Vue.use(iView, {
  locale
})
Vue.config.productionTip = false
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$delete = deleteData
Vue.prototype.$formData = formData
Vue.prototype.$download = download
Vue.prototype.$put = put
Vue.prototype.$formDataType2 = formDataType2
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
