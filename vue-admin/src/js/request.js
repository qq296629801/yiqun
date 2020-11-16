import { Message } from 'element-ui'
import axios from './axios'
import qs from 'qs' // 序列化时候用到

// get方式
const get = async (url, params) => {
    try {
        let { data: { success, data, errorHint } } = await axios.get(url, { params: params })
        if (success) {
            return data
        } else {
            Message.error(errorHint || '出现异常，请重新操作')
        }
    } catch (error) {
        console.log(error)
    }
}
// put方式 + 序列化格式
const put = async (url, params) => {
    try {
        let { data: { success, errorHint } } = await axios.put(url, qs.stringify(params))
        if (success) {
            return success
        } else {
            Message.error(errorHint || '出现异常，请重新操作')
        }
    } catch (error) {
        console.log(error)
    }
}
// delete 方式
const deleteData = async (url, params) => {
    try {
        let { data: { success, errorHint } } = await axios.delete(`${url}/${params}`)
        if (success) {
            return success
        } else {
            Message.error(errorHint || '出现异常，请重新操作')
        }
    } catch (error) {
        console.log(error)
    }
}
// post方式 + 序列化格式
const formData = async (url, params) => {
    try {
        let { data: { success, data, errorHint } } = await axios.post(url, qs.stringify(params))
        if (success) {
            return data
        } else {
            Message.error(errorHint || '出现异常，请重新操作')
        }
    } catch (error) {
        console.log(error)
    }
}
// post方式 + 序列化格式, 无data
const formDataType2 = async (url, params) => {
    try {
        let { data: { success, errorHint } } = await axios.post(url, qs.stringify(params))
        if (success) {
            return success
        } else {
            Message.error(errorHint || '出现异常，请重新操作')
        }
    } catch (error) {
        console.log(error)
    }
}
// post方式
const post = async (url, params) => {
    try {
        let { data: { success, data, errorHint } } = await axios.post(url, params)
        if (success) {
            return data
        } else {
            Message.error(errorHint || '出现异常，请重新操作')
        }
    } catch (error) {
        console.log(error)
    }
}
// 表格文件下载
const download = async (url, params) => {
    try {
        let data = await axios({
            method: 'post',
            url,
            data: qs.stringify(params),
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        if (data.data) {
            let fileName = data.headers['content-disposition'].split('filename=')[1]
            fileName = decodeURI(fileName)
            let blob = new Blob([data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
            if ('download' in document.createElement('a')) {
                const elink = document.createElement('a')
                const href = URL.createObjectURL(blob)
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = href
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(href)
                document.body.removeChild(elink)
            } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
            }
            return true
        } else {
            Message.error('导出失败')
        }
    } catch (error) {
        console.warn(error)
    }
}
export { post, get, deleteData, download, put, formData, formDataType2 }
