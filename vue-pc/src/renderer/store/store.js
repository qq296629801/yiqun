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
        userData:{}
    },
    mutations:{
        setUser(state,user){
            state.user=user
        },
        setUserData(state,userData){
            localStorage.setItem("userData", JSON.stringify(userData));
            state.userData=userData
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
        getUser(state){
            return state.user;
        },
        getUserData(state){
            let ud = localStorage.getItem("userData");
            ud = JSON.parse(ud);
            return ud?ud:state.userData;
        },
        getMembers(state){
            return state.members
        },
        getChatType(state){
            return state.chatType
        },
        getChat(state){
            return state.chat;
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