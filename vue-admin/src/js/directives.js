import Vue from 'vue'
let permissions = JSON.parse(localStorage.getItem('PERMISSIONS'))
// 防止重复点击
Vue.directive('preventReClick', {
    inserted (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 2000)
            }
        })
    }
})
// 权限指令
Vue.directive('hasPermission', {
    bind (el, binding) {
        if (permissions && !permissions.includes(binding.value)) {
            el.style.display = 'none'
        } else {
            permissions = JSON.parse(localStorage.getItem('PERMISSIONS'))
        }
    }
})
