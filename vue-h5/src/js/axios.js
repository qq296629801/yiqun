import axios from 'axios'
import { Toast } from 'mint-ui'
let axiosInstance = axios.create()
axiosInstance.defaults.timeout = 100000
axiosInstance.interceptors.request.use(config => {
  config.headers.Authentication = localStorage.getItem('token') || ''
  return config
}, error => {
  Toast('加载超时')
  return Promise.reject(error)
})
axiosInstance.interceptors.response.use(data => {
  if (data.status === 200) {
    return data
  }
}, error => {
  if (error.response) {
    let msg = (error.response.data === null ? '很抱歉，系统内部出现异常' : error.response.data.message) || '很抱歉，系统内部出现异常'
    switch (error.response.status) {
      case 404:
        Toast('很抱歉，资源未找到')
        break
      case 403:
      case 401:
        Toast('很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效')
        break
      default:
        Toast(msg)
        break
    }
  }
  return Promise.reject(error)
})
export default axiosInstance
