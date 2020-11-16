import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let common = {
    namespaced: true,
    state: {
        avatar: null,
        menuList: [],
        tableSortCondition: {}, // 获取表格排序信息
        userInfo: {}, // 用户信息
        menuMode: false // 菜单模式
    },
    getters: {
        // 用于对数据进行过滤处理
        getAvatar (state) {
            return state.avatar
        },
        getMenuList (state) {
            return state.menuList
        },
        getTableSortCondition (state) {
            return state.tableSortCondition
        },
        getUserInfo (state) {
            return state.userInfo
        },
        getMenuMode (state) {
            return state.menuMode
        }
    },
    mutations: {
        setAvatar (state, data) {
            state.avatar = data
        },
        setMenuList (state, data) {
            state.menuList = data
        },
        setTableSortCondition (state, data) {
            state.tableSortCondition = data
        },
        setUserInfo (state, data) {
            state.userInfo = data
        },
        setMenuMode (state, data) {
            state.menuMode = data
        }
    }
}

export default new Vuex.Store({
    modules: { common }
})
