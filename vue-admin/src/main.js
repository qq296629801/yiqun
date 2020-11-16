import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './theme/element-#2680EB/index.css'
import './assets/iconfont/iconfont.css'
import 'v-charts/lib/style.css'
import VCharts from 'v-charts'
import echarts from 'echarts'
import App from './App.vue'
import router from './router/index'
import routeList from './router/routes'
import store from './store'
import './js/directives'
import { post, get, deleteData, download, put, formData, formDataType2 } from './js/request'

Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.use(VCharts)
Vue.config.productionTip = false
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$delete = deleteData
Vue.prototype.$formData = formData
Vue.prototype.$download = download
Vue.prototype.$put = put
Vue.prototype.$formDataType2 = formDataType2
Vue.prototype.$echarts = echarts
Vue.prototype.$location = window.location

const filterRoutes = res => {
    for (let i = 0; i < res.length; i++) {
        if (res[i].component) {
            res[i].component = routeList[res[i].component]
            if (res[i].children) {
                filterRoutes(res[i].children)
            }
        }
    }
    return res
}
const addRoutes = [
    { name: '群设置', path: '/projectSet/:id', component: 'ProjectSet', hidden: true },
    { name: '用户编辑', path: '/userSet/:id', component: 'UserSet', hidden: true },
    { name: '个人中心', path: '/userInfo', component: 'UserInfo', hidden: true },
    { name: '群列表设置', path: '/groupListSet/:id', component: 'GroupListSet', hidden: true },
    { name: '用户列表编辑', path: '/userListSet/:id', component: 'UserListSet', hidden: true }
]
const getRoutes = () => {
    const username = JSON.parse(localStorage.getItem('USER')).username
    get(`menu/${username}`).then(res => {
        if (res) {
            store.commit('common/setMenuList', res[0].children)
            res[0].children.push(...addRoutes)
            router.addRoutes(filterRoutes(res))
        }
    })
}

Vue.prototype.$getRoutes = getRoutes

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        if (localStorage.getItem('USER_TOKEN')) {
            // !to.name && getRoutes()
            (from.name === '登录' || !to.name) && getRoutes()
            next()
        } else {
            next('/login')
        }
    }
})
router.afterEach((to, from) => {
    if (document.getElementsByClassName('el-main')[0]) {
        document.getElementsByClassName('el-main')[0].scrollTop = 0
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
