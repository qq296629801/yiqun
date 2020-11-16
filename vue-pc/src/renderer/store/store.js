import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        listLength: 0,
        chatList: [],
        msgList: [],
        cardList: [],
        card: {},
        token: null,
        chat:{},
        chatType:0,
        members:[],
        member:{},
        groups:[],
        friends:[],
        modalMine:false,
        user:{},
        host:'',
        message_flush:{}
    },
    mutations:{
        setHost(state,host){
            state.host=host
        },
        setUser(state,user){
            state.user=user
        },
        setMember(state,mem){
            state.member=mem
        },
        setFriends(state,friends){
            state.userList=friends
        },
        setGroups(state,groups){
            state.groups=groups
        },
        setMembers(state,members){
            state.members=members
        },
        setChatType(state, chatType){
            state.chatType = chatType
        },
        setChat(state, chat){
            state.chat = chat
        },
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
        setMsgList (state, data) {
            state.msgList = data
        }
    },
    actions:{

    },
    getters:{
        getMembers(state){
            return state.members
        },
        getChatType(state){
            return state.chatType
        },
        getChat(state){
            return state.chat;
        },
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
        getMsgList (state) {
            return state.msgList
        },
        getCardList (state) {
            return state.cardList
        }
    }
});

export default store;