import Vue from 'vue'
import Router from 'vue-router'
import Home from './views'
const GroupChat = () => import(/* webpackChunkName: "chat" */ './views/groupChat')
const FriendChat = () => import(/* webpackChunkName: "chat" */ './views/friendChat')
const ChatList = () => import(/* webpackChunkName: "chatList" */ './views/chatList')
const GroupChatList = () => import(/* webpackChunkName: "groupChatList" */ './views/groupList')
const Mine = () => import(/* webpackChunkName: "mine" */ './views/mine')
const PeronInfo = () => import(/* webpackChunkName: "mine" */ './views/mine/personInfo')
const AccountSet = () => import(/* webpackChunkName: "mine" */ './views/mine/accountSet')
const AboutUs = () => import(/* webpackChunkName: "mine" */ './views/mine/accountSet/aboutUs')
const PointRecords = () => import(/* webpackChunkName: "mine" */ './views/mine/accountSet/pointRecords')
const Login = () => import(/* webpackChunkName: "login" */ './views/login')
const GroupInfo = () => import(/* webpackChunkName: "member" */ './views/groupInfo')
const EditName = () => import(/* webpackChunkName: "FixName" */ './views/editName')
const GroupNotice = () => import(/* webpackChunkName: "maxCard" */ './views/groupNotice')
const GroupHistory = () => import(/* webpackChunkName: "chatHistory" */ './views/groupHistory')
const UpdatePassWord = () => import(/* webpackChunkName: "updatePwd" */ './views/changePwd')
const Remarks = () => import(/* webpackChunkName: "remarks" */ './views/remarks')
const LoadMsg = () => import(/* webpackChunkName: "loadMsg" */ './views/loadMsg')
const Forget = () => import(/* webpackChunkName: "forget" */ './views/login/forget')
const Contacts = () => import(/* webpackChunkName: "contacts" */ './views/groupList/contacts')
const Register = () => import(/* webpackChunkName: "register" */ './views/user/register')
const CreateGroup = () => import(/* webpackChunkName: "createGroup" */ './views/group/createGroup')
const ContactList = () => import(/* webpackChunkName: "createGroup" */ './views/group/contactList')
const CreateQrCode = () => import(/* webpackChunkName: "createCode" */ './views/mine/personInfo/createQrCode')
const ScanQrCode = () => import(/* webpackChunkName: "createCode" */ './views/mine/scanQrCode')
const BusinessCard = () => import(/* webpackChunkName: "createCode" */ './views/mine/personInfo/businessCard')
const DelMember = () => import(/* webpackChunkName: "group" */ './views/group/delMember')
const TransferGroup = () => import(/* webpackChunkName: "group" */ './views/group/transferGroup')
const AddFriend = () => import(/* webpackChunkName: "group" */ './views/user/addFriend')
const NewFriend = () => import(/* webpackChunkName: "group" */ './views/user/newFriend')
Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/chatList',
    children: [
      { path: '/contact',
        name: '联系人',
        component: Contacts,
        meta: {
          requireAuth: true
        } },
      { path: '/login', name: '登录', component: Login },
      { path: '/groupHistory',
        name: '群聊历史',
        component: GroupHistory,
        meta: {
          requireAuth: true
        } },
      { path: '/groupInfo',
        name: '群聊详情',
        component: GroupInfo,
        meta: {
          requireAuth: true
        } },
      { path: '/chatList',
        name: '聊天',
        component: ChatList,
        meta: {
          requireAuth: true
        } },
      { path: '/groupList',
        name: '群聊',
        component: GroupChatList,
        meta: {
          requireAuth: true
        } },
      { path: '/mine',
        name: '我的',
        component: Mine,
        meta: {
          requireAuth: true
        } },
      { path: '/pointRecords',
        name: '账户记录',
        component: PointRecords,
        meta: {
          requireAuth: true
        } },
      { path: '/aboutUs',
        name: '关于我们',
        component: AboutUs,
        meta: {
          requireAuth: true
        } },
      { path: '/peronInfo',
        name: '个人信息',
        component: PeronInfo,
        meta: {
          requireAuth: true
        } },
      { path: '/accountSet',
        name: '账户设置',
        component: AccountSet,
        meta: {
          requireAuth: true
        } },
      { path: '/groupChat',
        name: '群聊天',
        component: GroupChat,
        meta: {
          requireAuth: true
        } },
      { path: '/editName/:method',
        name: '编辑名称',
        component: EditName,
        meta: {
          requireAuth: true
        } },
      { path: '/groupNotice/:groupId',
        name: '群公告',
        component: GroupNotice,
        meta: {
          requireAuth: true
        } },
      { path: '/friendChat',
        name: '好友聊天',
        component: FriendChat,
        meta: {
          requireAuth: true
        } },
      { path: '/changePwd/:id',
        name: '修改密码',
        component: UpdatePassWord,
        meta: {
          requireAuth: true
        } },
      { path: '/remarks',
        name: '用户详情',
        component: Remarks,
        meta: {
          requireAuth: true
        } },
      { path: '/loadMsg',
        name: '数据同步中',
        component: LoadMsg,
        meta: {
          requireAuth: true
        } },
      { path: '/forget', name: '联系客服', component: Forget },
      { path: '/register',
        name: '注册中心',
        component: Register,
        meta: {
          requireAuth: true
        } },
      { path: '/createGroup',
        name: '创建群聊',
        component: CreateGroup,
        meta: {
          requireAuth: true
        } },
      { path: '/contactList',
        name: '选择联系人',
        component: ContactList,
        meta: {
          requireAuth: true
        } },
      { path: '/createQrCode',
        name: '二维码名片',
        component: CreateQrCode,
        meta: {
          requireAuth: true
        } },
      { path: '/scanQrCode',
        name: '扫二维码',
        component: ScanQrCode,
        meta: {
          requireAuth: true
        } },
      { path: '/businessCard',
        name: '名片',
        component: BusinessCard,
        meta: {
          requireAuth: true
        } },
      { path: '/delMember',
        name: '删除群成员',
        component: DelMember,
        meta: {
          requireAuth: true
        } },
      { path: '/transferGroup',
        name: '转让群主',
        component: TransferGroup,
        meta: {
          requireAuth: true
        } },
      { path: '/addFriend', name: '新朋友', component: AddFriend },
      { path: '/newFriend', name: '添加朋友', component: NewFriend }
    ]
  }
]

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
