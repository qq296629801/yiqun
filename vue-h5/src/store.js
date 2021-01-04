import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = {
  namespaced: true,
  state: {
    listLength: 0,
    chatList: [],
    messageList: [],
    cardList: [],
    card: {},
    token: null
  },
  getters: {
    getToken (state) {
      return state.token
    },
    getCard (state) {
      return state.card
    },
    getListLength (state) {
      return state.listLength
    },
    getChatList (state) {
      return state.chatList
    },
    getMessageList (state) {
      return state.messageList
    },
    getCardList (state) {
      return state.cardList
    }
  },
  mutations: {
    setToken (state, data) {
      state.token = data
    },
    setCard (state, data) {
      state.card = data
    },
    setCardList (state, data) {
      state.cardList = data
    },
    setListLength (state, data) {
      state.listLength = data
    },
    setChatList (state, data) {
      state.chatList = data
    },
    setMessageList (state, data) {
      state.messageList = data
    }
  },
  actions: {}
}

export default new Vuex.Store({
  modules: { store }
})
