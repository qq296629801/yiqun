import axios from 'axios'
import router from '../router/index'
import { Message } from 'element-ui'
axios.defaults.baseURL = '/'
axios.defaults.timeout = 30000
const toLogin = () => {
    Message.error('很抱歉，登录已过期，请重新登录')
    window.location.href = `${location.origin}/index.html#/login?redirect=${encodeURIComponent(window.location.href)}`
}
axios.interceptors.request.use(config => {
    config.headers.Authentication = JSON.parse(localStorage.getItem('USER_TOKEN'))
    return config
}, error => {
    Message.error('加载超时')
    return Promise.reject(error)
})
axios.interceptors.response.use(data => {
    if (data.status === 200) {
        let code = data.data.errorCode
        if (code === 'PORTAL-10004') {
            toLogin()
        } else if (code === 'PORTAL-10007') {
            toLogin()
        } else {
            return data
        }
    }
}, error => {
    switch (error.response.status) {
        case 403:
            router.push('/403')
            break
        case 404:
            router.push('/404')
            break
        case 500:
            router.push('/500')
            break
        default:
            router.push('/404')
            break
    }
    return Promise.reject(error)
})
export default axios
