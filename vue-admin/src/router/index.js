import Vue from 'vue'
import Router from 'vue-router'
import routeList from './routes'
Vue.use(Router)
const routes = [
    { path: '/login', name: '登录', component: routeList.Login },
    { path: '/403', name: '403', component: routeList.Error403 },
    { path: '/404', name: '404', component: routeList.Error404 },
    { path: '/500', name: '500', component: routeList.Error500 },
    { path: '/testmenu', name: '测试', component: routeList.Menu }
]
export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})
