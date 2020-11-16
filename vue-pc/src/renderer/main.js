import App from './App';
import router from './router';
import store from './store/store.js';
import Strophe from 'strophe.js'
import axios from './utils/axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'viewerjs/dist/viewer.css';
import VueParticles from 'vue-particles';
import vcolorpicker from 'vcolorpicker'
import Viewer from 'v-viewer';
import Vue from 'vue';
import webim from './utils/webim'
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(Viewer);
Vue.use(vcolorpicker)
Vue.use(VueParticles);
Vue.use(iView);
Vue.prototype.$socket = webim;
Vue.prototype.$axios = axios
Vue.prototype.$uploadUrl = 'http://120.27.95.106:9998/file/upload'
Vue.prototype.$url = "https://bzghost.com/upload/"
Vue.prototype.$ws = 'ws://120.27.95.106:9999/chat'

if (process.env.IS_WEB) {
    Vue.prototype.winControl = require('../main/webControl').default;
} else {
    Vue.use(require('vue-electron'))
    Vue.prototype.winControl = require('../main/windowControl').default;
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    Strophe,
    template: '<App/>'
}).$mount('#app');
