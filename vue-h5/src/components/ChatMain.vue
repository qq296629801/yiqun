<template>
  <div class="chat-view">
    <mt-header fixed :title="chatType === 1?chat.chatName+'('+members.length+')':chat.chatName">
      <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
      <mt-button v-if="chatType === 1" icon="more" slot="right" @click="handleToGroupInfo"></mt-button>
    </mt-header>
    <div ref="chatContent" @touchmove="handleBottom" class="chat-content" :style="showEmotion || showAddBox ? 'height:calc(75% - 80px);' : 'height:calc(100% - 50px);'" @click.stop="handleHideBox">
      <mt-loadmore :top-method="loadTop" ref="loadmore">
        <div class="message-content" :class="{'is-user': item.userName === user.userName}"
            v-for="(item, i) in messageList" :key="i">
          <img class="message-img" @click.stop="handleToRemarks(item)" :src="`${$url}/${item.userName === user.userName?user.avatar:item.avatar}`" alt="">
          <div class="message-wrap" @touchstart="messageTouchS(item)" @touchend="messageTouchE(item)">
            <div v-show="chatType === 1 && item.userName !== user.userName" class="top-name">{{item.remarkName || item.groupNickName || item.userName}}</div>
            <div style="float:left" :class="item.id + 'message'">

              <div v-if="item.msgType === 1" class="text-img">
                <img
                  class="preview-img"
                  v-preview="`${$url}/${item.msgContext}`"
                  :preview-title-enable="false"
                  :preview-nav-enable="true"
                  :src="`${$url}/scale_${item.msgContext}`"
                  alt=""
                >
              </div>
              <div v-if="item.msgType === 7" :style="item.status == 0?'background:orange':'background:#ffdb99'" :class="item.userName === user.userName?'message-red-packet-right':'message-red-packet-left'" @click="handleOpenRedPacket(item)">
                <div class="text">
                  <i slot="icon" :class="item.status == 0?'iconfont icon-hongbao':'iconfont icon-chaikai'" :style="item.status == 0?'color:red':'color:#ff8d8d'"></i>
                  <span class="packet">{{getRedPacketTitle(item.msgContext)}}</span>
                </div>
                <div class="footer">红包</div>
                <div class="arrow-org" :style="item.status == 0?'background:orange':'background:#ffdb99'"></div>
              </div>
              <div v-if="item.msgType === 0" class="message-text">
                <span class="wrapper" v-html="getEmotion(item.msgContext)"></span>
                <div class="arrow"></div>
              </div>
              <div v-if="item.msgType === 3" class="message-text" @click="handlePlay(item, 'audio')">
                <div :class="item.userName === user.userName ?'dot':'message-dot'" v-show="item.status === 0 && isApp"></div>
                <span>{{getTime(item.msgContext)}}</span>
                <i class="iconfont yuyin" :class="item.userName === user.userName ? 'icon-yuyinyou' : 'icon-yuyinzuo'"></i>
                <div class="arrow"></div>
              </div>

            <div v-if="item.msgType === 4" class="message-video" @click="handlePlay(item, 'video')">
              <video class="video" webkit-playsinline="true" x5-playsinline="true" x5-video-orientation="landscape|portrait" controls="controls">
                <source :src="`${$url}/${item.msgContext}`" type="video/mp4">
                your browser does not support the video tag
              </video>
            </div>
            <div :class="item.userName === user.userName?'message-time-owner':'message-time'">
              <span v-time="item.operTime"></span >
            </div>

            </div>
          </div>
        </div>
      </mt-loadmore>
    </div>
      <div class="footer-top">
        <div class="msg-notice" v-show="cardlist.length === 0? false: true" @click="handleBottomByCard">{{cardlist.length}}人提到了你</div>
        <div class="card-users" v-show="card">
          <mt-search class="chat-search" v-model="chatName"></mt-search>
          <template v-for="(item, i) in searchMembers">
            <group-chat-item :item="item" :key="i" @toChat="handleToChat(item)"></group-chat-item>
          </template>
        </div>
        <div :class="!lastMsg?'new-msg-hidden':'new-msg-show'" @click="handleTop" v-html="getEmotion(lastMsg)"></div>
        <i :class="`iconfont ${isKeyboard ? 'icon-jianpan1' : 'icon-yuyin'}`" @click="handleRecorder"></i>
        <template v-if="isKeyboard">
          <Recorder v-if="isApp" :uploadData="uploadData" @file="send2(3, $event)"/>
          <Recorder0 v-else :uploadData="uploadData" @file="send2(3, $event)"/>
        </template>
        <mt-field
          v-pos_fix
          @keyup.ctrl.enter.native="send2(0, text)"
          v-show="!isKeyboard"
          ref="inputVal"
          @focus.native.capture="handleFocus"
          @blur.native.capture="handleBlur"
          v-model="text"
          :disabled="disabledSay === 1 && chatType === 1"
          type="textarea" v-on:input="change">
        </mt-field>
        <i style="margin: 0 5px;" :class="`iconfont ${showEmotion ? 'icon-jianpan1' : 'icon-xiaolian'}`" @click="handleShowEmotion"></i>
        <i v-show="text" @click="send2(0, text)" class="iconfont icon-fasong_l"></i>
        <i v-show="!text" class="iconfont icon-addNew" @click="handleShowAddBox"></i>
      </div>
      <div class="emoticon-toolbar" v-show="showEmotion">
        <i @click="handleXiaolian" :class="emotionChoose?'iconfont icon-xiaolian action':'iconfont icon-xiaolian'"></i>
        <i :class="emotionChoose?'iconfont icon-aixin':'iconfont icon-aixin action'" @click="handleAixin"></i>
      </div>
      <div onselectstart="return false" class="emotion-box" v-show="showEmotion">
          <template v-if="emotionChoose">
            <span class="img" v-for="(value, key, i) in emotionList" :key="i" @click="getText(key)">
              <img :src="require(`../assets/face/${value}.png`)" alt="">
            </span>
          </template>
          <template v-else>
            <span class="cusEmotion">
              <input class="upload-photo" type="file" accept="image/*" multiple @change="updateImg($event, 1, false)">
              <i class="iconfont icon-zengjia-01"></i>
            </span>
            <span class="cusEmotion" v-for="(emoticon, key, i) in cusEmoticons" :key="i">
              <img :src="`${$url}/${emoticon.avatar}`" alt="" @click="send2(1, emoticon.avatar)" @touchstart="emotionTouchS(emoticon.id)" @touchend="emotionTouchE()">
            </span>
          </template>
      </div>
      <div class="add-box" v-show="showAddBox">
        <div class="add-item" v-for="(item, i) in addList" :key="i" @click="handleClickUploadIndex(i)">
          <input class="upload-photo" v-if="i === 0" type="file" accept="image/*" multiple @change="updateImg($event, 1, true)">
          <input class="upload-photo" v-if="i === 1" type="file" accept="image/*" capture="camera" @change="updateImg($event, 1, true)">
          <input class="upload-photo" v-if="i === 2" type="file" accept="video/*" multiple capture="camcorder" @change="updateImg($event, 4, true)">
          <i :class="`iconfont ${item.icon}`"></i>
          <span>{{item.name}}</span>
        </div>
      </div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" closeOnClickModal="true" position="middle">
      <div class="red-packet-box">
        <mt-header fixed style="background: #dc0000;color: white;border-top-left-radius: 10px;border-top-right-radius: 10px;">
          <mt-button slot="left" icon="back" @click="handleClose"></mt-button>
          <mt-button slot="right">发红包</mt-button>
        </mt-header>
        <div class="send-packet">
          <mt-field label="金额" v-model="redPacket.amount" @focus.native.capture="redPacket.amount = null" type="number"></mt-field>
          <mt-field label="个数" v-model="redPacket.number" @focus.native.capture="redPacket.number = null" type="number"></mt-field>
          <mt-field class="title" :placeholder="redPacket.title" @focus.native.capture="redPacket.title = null" v-model="redPacket.title" type="textarea"></mt-field>
          <div class="amount"><span>金额：</span>{{ redPacket.amount }} </div>
          <div class="amount"><span>总金额：</span>{{ user.money }} </div>
          <div class="send-btn"><mt-button size="large" type="danger" style="background: #dc0000;" @click="handleToSend">发送红包</mt-button></div>
        </div>
      </div>
    </mt-popup>
    <mt-popup v-model="popupRobVisible" popup-transition="popup-fade" closeOnClickModal="true" position="middle">
      <div class="mine-top-box">
        <mt-header fixed style="background: rgb(191, 0, 0);color: white;border-top-left-radius: 10px;border-top-right-radius: 10px;">
          <mt-button slot="left" icon="back" @click="handleClose"></mt-button>
          <mt-button slot="right">红包记录</mt-button>
        </mt-header>
        <div class="box-btn" v-show="redPacketItem.status === 0">
          <div class="packet-btn" @click="robPacket">拆开红包</div>
        </div>
        <div class="box" v-show="redPacketItem.status === 2">
          <div class="packet">
              <div class="send">
                <img :src="`${$url}/${ packet.userAvatar }`" :alt="packet.userName" />
                <span>{{ packet.userName }} 的红包</span>
              </div>
              <div class="welcome">{{packet.description === '' ? '恭喜发财，大吉大利':packet.description}}</div>
              <template v-for="(r, i) in records">
                <div class="amount" :key="r.robUid" v-if="user.id === r.robUid">{{ r.money }}  <span>元</span></div>
                <div class="notice" :key="i" v-if="user.id === r.robUid">已经存入余额,可用于发红包</div>
              </template>
          </div>
          <div class="title">{{ packet.number }} 个红包，剩余金额 {{ packet.surplusMoney }} 元，剩余红包 {{ packet.surplusNumber }} 个</div>
          <div class="records">
            <template v-for="(item, i) in records">
              <div class="item" :key="i">
                <div class="left-img">
                  <img :src="`${$url}/${ item.userAvatar }`" width="57" height="57" :alt="i" />
                </div>
                <div class="right-box">
                  <div class="right-box-top">
                    <span class="name">{{ item.remarkName || item.groupNickName || item.userName }}</span>
                    <span class="money">{{ item.money }}元</span>
                  </div>
                  <div class="right-box-bot" v-datetime="item.lastUpdateTime"></div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </mt-popup>
    <mt-popup v-model="popupFuncVisible" popup-transition="popup-fade" closeOnClickModal="true" position="right">
      <div class="func-box">
        <div class="func-btn" @click="handleAddEmoticon(message.msgContext)" v-show="message.msgType === 1">收藏</div>
        <div class="func-btn" @click="handleToOpenForward" v-show="message.msgType !== 7">转发</div>
        <div class="func-btn" @click="handleRollback" v-show="user.userName === message.userName || (!groupUser ? false : groupUser.groupMaster)">撤销</div>
      </div>
    </mt-popup>
    <mt-popup v-model="popupForwardVisible" popup-transition="popup-fade" closeOnClickModal="true" position="middle">
      <div class="chat-forward">
        <mt-search class="chat-search" v-model="chatListName"></mt-search>
        <template v-for="(item, i) in searchChatList">
            <group-chat-item :item="item" :key="i" @toChat="handleToForward(item)"></group-chat-item>
        </template>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import emotionList from '@/components/emotion.json'
import { Toast } from 'mint-ui'
import Recorder from '@/components/Recorder'
import Recorder0 from '@/components/Recorder0'
import lrz from 'lrz'
import GroupChatItem from '@/components/GroupChatItem'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'ChatView',
  components: { Recorder, Recorder0, GroupChatItem },
  props: {
    chatType: {
      type: Number,
      required: true
    },
    chat: {
      type: Object,
      required: true
    }
  },
  data () {
    const user = localStorage.getItem('user')
    const $url = this.$url
    return {
      groupUser: {},
      group: {},
      popupFuncVisible: false,
      popupForwardVisible: false,
      chatName: '',
      chatListName: '',
      redPacket: {
        title: '恭喜发财,大吉大利',
        amount: 0.00,
        number: 0,
        status: 0
      },
      popupVisible: false,
      popupRobVisible: false,
      cardlist: this.getCardList(),
      messageList: [],
      messageStr: ['图片', '表情', '语音', '视频', '签到', '撤销', '发红包', '抢红包'],
      position: [],
      card: false,
      members: [],
      searchMembers: [],
      searchChatList: [],
      isBottom: false,
      lastMsg: '',
      isUp: false,
      isApp: window.isApp,
      timer: null,
      size: 0,
      user: (user && JSON.parse(user)) || null,
      pageNum: 1,
      appPage: 0,
      disabledSay: 0,
      allLoaded: false,
      isKeyboard: false,
      uploadData: {
        uploadUrl: `${$url}/file/upload`
      },
      text: '',
      showAddBox: false,
      showEmotion: false,
      playFlag: true,
      emotionList,
      addList: [
        { key: 'handlePicture', icon: 'icon-picture-fill', name: '照片' },
        { key: 'handleShot', icon: 'icon-paishe_A_Facet', name: '拍摄' },
        { key: 'handleField', icon: 'icon-shipin', name: '视频' },
        { key: 'handleSignIn', icon: 'icon-qiandao', name: '签到' },
        { key: 'handleRedPacket', icon: 'icon-hongbao', name: '红包' }
      ],
      audio: null,
      packet: {},
      records: [],
      redPacketItem: {},
      message: {},
      emotionChoose: true,
      cusEmoticons: [],
      keepalive: false
    }
  },
  load: {
    dom () {
    },
    plus: () => {
      if (window.isApp) {
        window.plus.io.resolveLocalFileSystemURL('_doc/', function (entry) {
          entry.getDirectory('camera', { create: true }, function (dir) {
          }, function (e) {
            console.log('Get directory "camera" failed: ' + e.message)
          })
        }, function (e) {
          console.log('Resolve "_doc/" failed: ' + e.message)
        })
      }
    }
  },
  destroyed () {
    this.stopPlay()
    this.disableScroll()
  },
  mounted () {
    this.enableScroll()
    this.getGroupUser()
    this.queryPageMessages()
    this.queryMembers()
    this.openChat()
    this.send2(0, '', true)
  },
  watch: {
    chatName (val) {
      this.searchMembers = this.members.filter(v => { return v.chatName.includes(val) })
    },
    chatListName (val) {
      this.searchChatList = this.getChatList().filter(v => { return v.chatName.includes(val) })
    }
  },
  methods: {
    ...mapMutations({
      setListLength: 'store/setListLength',
      setCardList: 'store/setCardList'
    }),
    ...mapGetters({
      getCardList: 'store/getCardList'
    }),
    disableScroll () {
      if (!this.isApp) {
        window.removeEventListener('scroll', this.handleScroll, true)
      }
    },
    enableScroll () {
      if (!this.isApp) {
        window.addEventListener('scroll', this.handleScroll, true)
      }
    },
    createLocalMsg (m) {
      /* if (window.isApp) {
        this.$sqlite.insert(m, this.chatType)
        this.$sqlite.close()
      } */
    },
    pushLocalMsg (m) {
      if (window.isApp) {
        if (navigator.userAgent.indexOf('StreamApp') > 0) {
          console.log('当前环境不支持推送')
        } else {
          var options = { cover: false }
          let str = m.msgType === 0 ? m.msgContext : this.messageStr[m.msgType]
          window.plus.push.createMessage(this.chat.chatName + ' : ' + str, 'LocalMSG', options)
          if (window.plus.os.name === 'iOS') {
            console.log('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!')
          }
        }
      }
    },
    // 拍照
    getImage (msgType) {
      var cmr = window.plus.camera.getCamera()
      cmr.captureImage((p) => {
        window.plus.io.resolveLocalFileSystemURL(p, (entry) => {
          this.upload(p, msgType)
        }, function (e) {
          console.log('读取拍照文件错误：' + e.message)
        })
      }, function (e) {
        console.log('失败：' + e.message)
      }, { filename: '_doc/camera/', index: 1 })
    },
    // 录像
    getVideo (msgType) {
      var cmr = window.plus.camera.getCamera()
      cmr.startVideoCapture((p) => {
        window.plus.io.resolveLocalFileSystemURL(p, (entry) => {
          this.upload(p, msgType)
        }, function (e) {
          console.log('读取录像文件错误：' + e.message)
        })
      }, function (e) {
        console.log('失败：' + e.message)
      }, { filename: '_doc/camera/', index: 1 })
    },
    upload (path, msgType) {
      var task = window.plus.uploader.createUpload(`${this.$url}/file/upload`,
        { method: 'POST' },
        (t) => { // 上传完成
          let res = JSON.parse(t.responseText)
          if (res.success) {
            this.send2(msgType, res.data)
          } else {
            Toast('添加失败：' + status + t)
          }
        }
      )
      task.addFile(path, { key: 'file' })
      task.start()
    },
    getGroupUser () {
      if (this.chatType === 1) {
        this.$socket.queryGroupUser(this.user.id, this.chat.chatId, res => {
          this.groupUser = res.groupUser
          this.group = res.group
        })
      }
    },
    handleToOpenForward () {
      this.searchChatList = this.getChatList()
      this.popupForwardVisible = true
      this.popupFuncVisible = false
    },
    handleToForward (item) {
      this.popupForwardVisible = false
      let flag = this.chatType === 1
      if (flag && this.disabledSay === 1) {
        Toast('你已经被禁言')
        return false
      }
      this.select2(item.chatType, this.message.msgType, this.message.msgContext, false, item.chatId)
    },
    handleFreshTotal () {
      this.$socket.chats('', this.user.id, (res) => {
        if (res.success) {
          let arr = res.chats
          let total = 0
          if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              total = total + arr[i].unreadNumber
            }
          }
          this.setListLength(total)
        }
      })
    },
    handleAddEmoticon (msgContext) {
      this.popupFuncVisible = false
      this.$socket.addEmoticon(this.user.id, msgContext, res => {
        if (res.success) {
          this.handleAixin()
          Toast('收藏成功')
        } else {
          Toast('收藏失败')
        }
      })
    },
    handleAixin () {
      this.emotionChoose = false
      this.$socket.getEmoticons(this.user.id, res => {
        this.cusEmoticons = res.emoticons
      })
    },
    handleXiaolian () {
      this.emotionChoose = true
    },
    handleRollback () {
      let t = ((new Date()).getTime() - this.message.operTime) / 60000
      if (t <= 2 ||
        (!this.groupUser ? false : this.groupUser.groupMaster)) {
        this.$messagebox.confirm('是否撤回消息').then(action => {
          let del = this.chatType === 0 ? 'deleteFriendMsg' : 'deleteGroupMsg'
          this.$socket[del](this.user.id, this.message.id, this.group.id, res => {
            if (res.success) {
              this.send2(6, this.message.id)
              this.popupFuncVisible = false
            }
          })
        }, cancel => {
          console.log(cancel + 'cancel')
        })
      } else {
        this.popupFuncVisible = false
        Toast('该消息已超过时间限制，无法撤销')
      }
    },
    handleClose () {
      this.popupVisible = false
      this.popupRobVisible = false
    },
    robPacket () {
      this.$nextTick(() => {
        document.getElementsByClassName('mint-field-core')[0].blur()
        this.isKeyboard = false
      })
      this.send2(8, this.redPacketItem.id)
    },
    getRedPacketTitle (message) {
      let packet = JSON.parse(message).Packets[0]
      if (packet.description === undefined) {
        return '恭喜发财，大吉大利'
      }
      return packet.description === '' ? '恭喜发财，大吉大利' : packet.description
    },
    handleOpenRedPacket (item) {
      this.$nextTick(() => {
        document.getElementsByClassName('mint-field-core')[0].blur()
        this.isKeyboard = false
      })
      this.redPacketItem = item
      this.$socket.queryMsgByChatId(item.id, item.groupId, this.user.id, res => {
        this.redPacketItem.msgContext = res.msgContext
        this.popupRobVisible = true
        this.packet = JSON.parse(this.redPacketItem.msgContext).Packets[0]
        this.records = this.packet.Records
        this.setUserCache()
        /* if (this.isApp) {
          this.$sqlite.open()
          this.$sqlite.update(this.redPacketItem.msgContext, this.redPacketItem.id, this.chatType)
          this.$sqlite.close()
        } */
      })
    },
    handleToSend () {
      if (this.chatType === 0) {
        Toast('暂不支持私包')
        return
      }
      if (this.redPacket.amount === null) {
        Toast('金额不能为null')
        return
      }
      if (this.redPacket.number === null) {
        Toast('个数不能为null')
        return
      }
      if (this.redPacket.title === '') {
        Toast('标题不能为null')
        return
      }
      if (this.redPacket.amount > this.user.money) {
        Toast('余额不足')
        return
      }
      if (this.redPacket.amount === 0.00 || this.redPacket.number === 0) {
        Toast('余额或者数量必须大于0')
        return
      }
      this.send2(7, this.redPacket)
      this.popupVisible = false
      this.redPacket.amount = 0.00
      this.redPacket.number = 0
    },
    handleToChat (item) {
      this.text = this.text.replace('@', '#' + item.groupNickName + ' ')
      this.card = false
    },
    change () {
      this.card = false
      if (this.text.includes('@')) {
        this.card = true
      }
    },
    queryMembers () {
      this.$socket.queryMembers(this.chat.chatId, this.user.id, (res) => {
        this.members = res.members
        this.searchMembers = res.members
      })
    },
    handleTop () {
      this.scrollToBottom()
      this.lastMsg = ''
      this.isBottom = true
    },
    // @功能
    handleBottomByCard () {
      this.$nextTick(() => {
        if (this.$refs.loadmore !== undefined) {
          let div = this.$refs.loadmore.$el
          let childDiv = div.getElementsByClassName('message-content')
          let heightSum = 0
          for (var j in this.cardlist) {
            for (var i in childDiv) {
              let content = childDiv[i].innerText
              if (content !== undefined) {
                heightSum += childDiv[i].clientHeight
                let message = childDiv[i].getElementsByClassName(this.cardlist[j] + 'message')
                if (message.length !== 0) {
                  this.position.push({ id: this.cardlist[j], height: heightSum })
                }
              }
            }
          }
          try {
            div.scrollTop = this.position[0].height
            this.cardlist.splice(0, 1)
            this.setCardList(this.cardlist)
            this.position.splice(0, 1)
          } catch (e) {
            this.cardlist = []
            this.setCardList([])
          }
        }
      })
    },
    handleBottom () {
      let scrollTop = Math.floor(document.getElementsByClassName('mint-loadmore')[0].scrollTop)
      if (this.isUpOrDown() && scrollTop <= 0) {
        this.loadMore()
      }
      this.$nextTick(() => {
        if (this.$refs.loadmore !== undefined) {
          let div = this.$refs.loadmore.$el
          let allHeight = scrollTop + div.clientHeight
          this.isBottom = false
          if ((div.scrollHeight - allHeight) <= 100) {
            this.lastMsg = ''
            this.isBottom = true
          }
        }
      })
    },
    handleScroll () {
      let scrollTop = Math.floor(document.getElementsByClassName('mint-loadmore')[0].scrollTop)
      if (this.isUpOrDown() && scrollTop <= 0) {
        this.loadMore()
      }
      this.$nextTick(() => {
        if (this.$refs.loadmore !== undefined) {
          let div = this.$refs.loadmore.$el
          let allHeight = div.scrollTop + div.clientHeight
          this.isBottom = false
          if ((div.scrollHeight - allHeight) <= 100) {
            this.lastMsg = ''
            this.isBottom = true
          }
        }
      })
    },
    isUpOrDown () {
      if (/.*Firefox.*/.test(navigator.userAgent)) {
        document.addEventListener('DOMMouseScroll', (e) => {
          e = e || window.event
          this.isUp = e.detail <= 0
        })
      } else {
        document.onmousewheel = (e) => {
          e = e || window.event
          this.isUp = e.wheelDelta > 0
        }
      }
      return this.isUp
    },
    handleRecorder () {
      window.scrollTo(0, 0)
      this.isKeyboard = !this.isKeyboard
      if (!this.isKeyboard) {
        this.$nextTick(() => {
          document.getElementsByClassName('mint-field-core')[0].focus()
        })
      }
    },
    handleFocus () {
      this.showAddBox = false
      this.showEmotion = false
    },
    handleBlur () {
      // if (this.showAddBox || this.showEmotion) {
      //   return
      // }
      // window.scrollTo(0, 0)
    },
    responLastMessage (msgList) {
      if (msgList.length !== 0) {
        let msg = msgList[0]
        if (this.$route.name === '好友聊天' || this.$route.name === '群聊天') {
        } else {
          this.pushLocalMsg(msg)
        }
      }
      msgList.forEach(m => {
        if (m.msgType === 7) {
          this.changeStatusRob(m)
        }
        if (!this.messageList.map(v => v.id).includes(m.id)) {
          this.messageList.push(m)
          this.createLocalMsg(m)
          if (m.sendUid === this.user.id) {
            this.scrollToBottom()
            this.lastMsg = ''
          } else {
            let str = m.msgType === 0 ? m.msgContext : this.messageStr[m.msgType]
            this.lastMsg = str
            if (this.isBottom) {
              this.lastMsg = ''
              this.scrollToBottom()
            }
            if (this.chatType === 1) {
              // 判断消息是否有人@自己
              if (m.msgContext.includes('#' + this.groupUser.groupNickName) ||
                m.msgContext.includes('@all') ||
                m.msgContext.includes('@ALL')) {
                this.cardlist.push(m.id)
                this.setCardList(this.cardlist)
              } else if (m.msgContext.includes('#' + this.user.userName) ||
                m.msgContext.includes('@all') ||
                m.msgContext.includes('@ALL')) {
                this.cardlist.push(m.id)
                this.setCardList(this.cardlist)
              }
            }
          }
        }
      })
      this.messageList.sort((a, b) => { return a.id - b.id })
    },
    playRecord (url) {
      if (this.playFlag) {
        this.playFlag = false
        this.audio = window.plus.audio.createPlayer(url)
        this.audio.play(() => {
          this.stopPlay()
          this.playFlag = true
        }, function (e) {
          console.log('播放音频文件"' + url + '"失败：' + e.message)
        })
      } else {
        this.stopPlay()
        this.playFlag = true
      }
    },
    stopPlay () {
      if (this.audio) {
        this.audio.stop()
        this.audio = null
      }
    },
    handleToGroupInfo () {
      this.$router.push('/groupInfo')
    },
    changeStatusRob (m) {
      let packet = JSON.parse(m.msgContext).Packets[0]
      if (packet === undefined) {
        return
      }
      let records = packet.Records
      if (records === undefined) {
        return
      }
      records.forEach(r => {
        if (packet.surplusNumber === 0 && packet.surplusMoney === 0) {
          m.status = 2
        }
        if (r.robUid === this.user.id) {
          m.status = 2
        }
      })
    },
    queryPageMessages () {
      this.pageNum = 1
      const str = this.chatType === 1 ? 'queryGroupMessages' : 'queryFriendMessages'
      this.$socket[str](this.chat.chatId, this.user.id, this.pageNum, (res) => {
        if (res.success) {
          this.messageList = res.response.data
          if (this.messageList) {
            this.messageList.forEach(m => {
              if (m.msgType === 7) {
                this.changeStatusRob(m)
              }
            })
          }
          this.messageList.sort((a, b) => { return a.id - b.id })
          this.scrollToBottom()
        }
      })
      /* this.appPage = 0
        this.$sqlite.open()
        window.plus.sqlite.selectSql({
          name: 'talk',
          sql: this.chatType === 1 ? "SELECT * FROM s_group_msg where groupId = '" + this.chat.chatId + "' order by id desc LIMIT 10 OFFSET " + (10 * this.appPage)
            : "SELECT * FROM s_friend_msg where (receiveUid = '" + this.chat.chatId + "' and sendUid = '" + this.user.id + "') or (receiveUid ='" + this.user.id + "' and sendUid = '" + this.chat.chatId + "') order by id desc LIMIT 10 OFFSET " + (10 * this.appPage),
          success: (data) => {
            for (var i in data) {
              data[i].operTime = data[i].operTime * 1000
            }
            this.firstGetMessages(data)
            this.$sqlite.close()
            this.messageList.sort((a, b) => { return a.id - b.id })
          },
          fail: function (e) {
            console.log('分页搜索 fail: ' + JSON.stringify(e))
            this.$sqlite.close()
          }
        }) */
    },
    openChat () {
      this.$socket.openChat(this.chat.chatId, this.user.id, this.chatType, res => {
        if (res.success) {
          if (this.chatType === 1) {
            if (res.groupUser === undefined) {
              this.disabledSay = 1
            } else {
              this.disabledSay = res.groupUser.status
            }
          }
        }
      })
    },
    handleToRemarks (item) {
      item.chatName = item.groupNickName
      item.chatType = 0
      item.chatId = item.sendUid
      let groupItem = {
        group: this.group,
        groupUser: this.groupUser
      }
      localStorage.setItem('groupItem', JSON.stringify(groupItem))
      localStorage.setItem('userItem', JSON.stringify(item))
      this.$router.push('/remarks')
    },
    emotionTouchS (id) {
      this.timer = setTimeout(() => {
        this.$messagebox.confirm('是否删除表情').then(action => {
          this.$socket.deleteEmontion(this.user.id, id, res => {
            if (res.success) {
              this.handleAixin()
              Toast('删除成功')
            }
          })
        }, cancel => {
          console.log(cancel + 'cancel')
        })
      }, 1000)
    },
    emotionTouchE () {
      window.clearTimeout(this.timer)
      this.timer = null
    },
    messageTouchS (item) {
      this.timer = setTimeout(() => {
        this.popupFuncVisible = true
        this.message = item
      }, 1000)
    },
    messageTouchE () {
      window.clearTimeout(this.timer)
      this.timer = null
    },
    // 播放时间
    getTime (msgContext) {
      const { time } = JSON.parse(msgContext)
      return `${time}'' `
    },
    handlePlay (item, type) {
      const { url } = JSON.parse(item.msgContext)
      if (window.isApp) {
        this.playRecord(`${this.$url}/${url}`)
        // this.$sqlite.open()
        // this.$sqlite.stopRecord(this.chatType, item.id)
        // this.$sqlite.close()
        item.status = 3
      } else {
        let flag = true
        let medias = document.getElementsByTagName(type)
        for (const key in medias) {
          if (medias[key].paused === false) {
            medias[key].pause()
          }
          if (medias[key].id - 0 === item.id) {
            medias[key].currentTime = 0
            medias[key].play()
            flag = false
          }
        }
        if (flag) {
          const media = document.createElement(type)
          media.src = `${this.$url}/${url}`
          media.id = item.id
          document.body.appendChild(media)
          media.play().then()
        }
      }
    },
    // 点击空白部分隐藏下面输入
    handleHideBox () {
      this.showEmotion = false
      this.showAddBox = false
      window.scrollTo(0, 0)
      // 隐藏@卡片
      this.card = false
    },
    // 滚动条滚动到底部
    scrollToBottom () {
      this.$nextTick(() => {
        if (this.$refs.loadmore !== undefined) {
          let div = this.$refs.loadmore.$el
          div.scrollTop = div.scrollHeight
        }
      })
    },
    // 表情替换
    getEmotion (msg) {
      msg = msg.replace(/\[.+?\]/g, (a, b) => {
        let index = this.emotionList[a]
        if (!index) {
          return a
        } else {
          let url = require(`../assets/face/${index}.png`)
          return `<img class="emotion-img" src=${url} alt="" />`
        }
      })
      return msg
    },
    // 处理加号里面的各种事件
    handleClickUploadIndex (i) {
      if (i === 3) {
        this.$socket.attend(this.chat.chatId, this.user.id, res => {
          if (res.success) {
            this.setUserCache()
            Toast('签到成功')
          } else {
            Toast('今天已经签到')
          }
        })
      }
      if (i === 1 && this.isApp) {
        this.getImage(1)
      }
      if (i === 2 && this.isApp) {
        this.getVideo(4)
      }
      if (i === 4) {
        this.popupVisible = true
      }
    },
    // 单文件上传
    updateImg (el, type, send) {
      if (!el.target.files[0].size) return
      this.filesList(el.target.files, type, send)
    },
    // 遍历图片列表
    filesList (files, type, send) {
      [...files].forEach((v) => this.fileAdd(v, type, send))
    },
    // 添加到渲染列表
    fileAdd (file, type, send) {
      this.size += file.size
      this.postData(file, type, send)
    },
    postData (file, type, isSend) {
      let index = file.name.lastIndexOf('.')
      let suffix = file.name.substr(index)
      if (type === 4 || suffix === '.gif' || suffix === '.GIF') {
        let formData = new FormData()
        formData.append('file', file)
        this.$axios.post(this.uploadData.uploadUrl, formData).then((res) => {
          if (res.data.success) {
            if (isSend) {
              this.send2(type, res.data.data)
            } else {
              this.handleAddEmoticon(res.data.data)
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        lrz(file, {
          width: 600,
          quality: 0.8
        }).then((rst) => {
          // 成功时执行
          let formData = new FormData()
          formData.append('file', rst.file, rst.origin.name)
          this.$axios.post(this.uploadData.uploadUrl, formData).then((res) => {
            if (res.data.success) {
              if (isSend) {
                this.send2(type, res.data.data)
              } else {
                this.handleAddEmoticon(res.data.data)
              }
            }
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log(error)
        }).always(function () {
          // 不管成功或失败，都会执行
        })
      }
    },
    response (data) {
      data.forEach(m => {
        if (m.msgType === 7) {
          this.changeStatusRob(m)
        }
        if (!this.messageList.map(v => v.id).includes(m.id)) {
          this.messageList.push(m)
        }
      })
      this.messageList.sort((a, b) => { return a.id - b.id })
    },
    loadMore () {
      this.pageNum += 1
      let str = this.chatType === 1 ? 'queryGroupMessages' : 'queryFriendMessages'
      this.$socket[str](this.chat.chatId, this.user.id, this.pageNum, res => { this.response(res.response.data) })
      // this.appPage += 1
      // this.$sqlite.open()
      // window.plus.sqlite.selectSql({
      //   name: 'talk',
      //   sql: this.chatType === 1 ? "SELECT * FROM s_group_msg where groupId = '" + this.chat.chatId + "' order by id desc LIMIT 10 OFFSET " + (10 * this.appPage)
      //     : "SELECT * FROM s_friend_msg where (receiveUid = '" + this.chat.chatId + "' and sendUid = '" + this.user.id + "') or (receiveUid ='" + this.user.id + "' and sendUid = '" + this.chat.chatId + "') order by id desc LIMIT 10 OFFSET " + (10 * this.appPage),
      //   success: (data) => {
      //     for (var i in data) {
      //       data[i].operTime = data[i].operTime * 1000
      //     }
      //     this.response(data)
      //     this.$sqlite.close()
      //   },
      //   fail: function (e) {
      //     console.log('分页搜索 fail: ' + JSON.stringify(e))
      //     this.$sqlite.close()
      //   }
      // })
    },
    loadTop () {
      this.loadMore()
      this.$refs.loadmore.onTopLoaded()
    },
    handleShowAddBox () {
      window.scrollTo(0, 0)
      this.isKeyboard = false
      this.showEmotion = false
      this.showAddBox = !this.showAddBox
      this.scrollToBottom()
    },
    handleShowEmotion () {
      window.scrollTo(0, 0)
      this.isKeyboard = false
      this.showAddBox = false
      this.showEmotion = !this.showEmotion
      this.scrollToBottom()
      if (!this.showEmotion) {
        document.getElementsByClassName('mint-field-core')[0].focus()
      }
    },
    getText (key) {
      this.text = `${this.text}${key}`
    },
    setUserCache () {
      this.$socket.getUserById(this.user.id, res => {
        localStorage.setItem('user', JSON.stringify(res.user))
      })
    },
    cancelRespone (res) {
      for (var i in this.messageList) {
        if (this.messageList[i].id === res.msgId) {
          this.messageList.splice(i, 1)
          /* if (this.isApp) {
            this.$sqlite.open()
            this.$sqlite.delete(parseInt(res.chatId), this.chatType)
            this.$sqlite.close()
          } */
        }
      }
    },
    redpacketRespon (res) {
      this.messageList.forEach(m => {
        if (m.id === res.msgId) {
          if (res.userId === this.user.id || this.redPacketItem.id === m.id || this.popupRobVisible === false) {
            m.msgContext = res.message
            this.changeStatusRob(m)
            this.redPacketItem = m
            this.packet = JSON.parse(m.msgContext).Packets[0]
            this.records = this.packet.Records
            this.setUserCache()
            /* if (this.isApp) {
              this.$sqlite.open()
              this.$sqlite.update(this.redPacketItem.msgContext, this.redPacketItem.id, this.chatType)
              this.$sqlite.close()
            } */
          }
        }
      })
    },
    select2 (flag, msgType, content, stop, chatId) {
      let str = flag ? 'send2Group' : 'send2Friend'
      this.$socket[str](chatId, this.user.id, content || '', msgType, res => {
        if (res.success) {
          // 撤销
          if (res.msgId !== undefined && res.message === undefined) {
            this.cancelRespone(res)
            // 抢红包
          } else if (res.msgId !== undefined && res.message !== undefined) {
            this.redpacketRespon(res)
          } else {
            // 其他消息
            let msgList = []
            let message = {}
            if (res.response !== undefined) {
              message = res.response.data
              if (this.chatType === 1) {
                if (message.groupId === this.chat.chatId) {
                  msgList.push(message)
                  this.responLastMessage(msgList)
                }
              } else {
                msgList.push(message)
                this.responLastMessage(msgList)
              }
            }
          }
          this.handleFreshTotal()
        }
      })
      this.openChat()
      this.text = ''
      if (this.showAddBox || this.showEmotion || stop) {
        return
      }
      document.getElementsByClassName('mint-field-core')[0].focus()
    },
    send2 (msgType, text, stop) {
      let flag = this.chatType === 1
      if (flag && this.disabledSay === 1) {
        Toast('你已经被禁言')
        return false
      }
      this.select2(flag, msgType, text, stop, this.chat.chatId)
      if (this.chatType === 1 && text !== '') {
        this.$socket.createChatList(this.user.id, this.chat.chatId, text, msgType, res => {})
      }
    }
  }
}
</script>
<style lang="less">
  .mint-popup {
    border-radius: 10px;
  }
  .func-box {
    width: 60px;
    height: auto;
    overflow: hidden;
    background: #fff;
    color: #000;
    .func-btn {
      width: 100%;
      height: 60px;
      border-bottom: 1px solid gray;
      overflow: hidden;
      background: #fff;
      color: #000;
      text-align: center;
      line-height: 60px;
      font-size: 16px;
    }
  }
  .chat-search {
    position: fixed;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 50px;
  }
  .mint-searchbar {
    position: relative;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #fff;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 0.213333rem 0.266667rem;
    z-index: 1;
  }
  .chat-forward {
    height: 500px;
    overflow: scroll;
  }
  .mine-top-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
    width: 300px;
    margin-bottom: 10px;
    .box-btn {
      .packet-btn {
        background: red;
        color: white;
        height: 30px;
        width: 100px;
        border-radius: 5px;
        line-height: 32px;
      }
    }
    .box {
      width: 100%;
      height: 86%;
      .packet {
        color: #ffc112;
        width: 100%;
        height: 45%;
        padding-top: 20px;
        background: #dc0000;
        .welcome {
          width: 100%;
        }
        .title {
          color: #999999;
        }
        .amount {
          width: 100%;
          overflow: hidden;
          font-size: 30px;
          padding-top: 20px;
          span {
            font-size: 15px;
          }
        }
        .notice {
          width: 100%;
        }
        .send {
          height: 50px;
          width: 200px;
          margin-left: auto;
          margin-right: auto;
          line-height: 30px;
          overflow: hidden;
          padding-top: 4px;
          color: #ffc112;
          img {
            width: 30px;
            height: 30px;
            border-radius: 10px;
            float: left;
          }
          span {
            font-size: 25px;
            padding-left: 10px;
            float: left;
          }
        }
      }
      .title {
        text-align: left;
        border-bottom: 1px solid #ececec;
        font-size: 15px;
        text-align: left;
        height: 10%;
        overflow: hidden;
        line-height: 40px;
        padding-left: 10px;
      }
      .records {
        overflow-y: scroll;
        width: 100%;
        height: 50%;
        background: #fff;
        .item {
          border-bottom: 1px solid #ececec;
          width: 100%;
          height: 80px;
          .left-img {
            padding-left: 10px;
            padding-top: 10px;
            float: left;
            width: 20%;
            /*img {*/
              /*width: 57px;*/
              /*height: 57px;*/
              /*border-radius: 10px;*/
            /*}*/
          }
          .right-box {
            padding: 15px;
            color: black;
            font-size: 15px;
            width: 80%;
            float: left;
            .right-box-top {
              width: 100%;
              height: 30px;
              .name {
                float: left;
              }
              .money {
                float: right;
              }
            }
            .right-box-bot {
              text-align: left;
              color: gray;
            }
          }
        }
      }
    }
  }
  .red-packet-box {
    height: 480px;
    width: 300px;
    .send-packet {
      height: 100%;
      padding-top: 30px;
      .mint-cell {
        height: 100px;
      }
      .send-btn {
        width: 50%;
        margin-left: auto;
        margin-right: auto;
        padding-top: 20px;
      }
      .amount {
        width: 100%;
        overflow: hidden;
        font-size: 30px;
        span {
          font-size: 15px;
        }
      }
    }
  }
  .chat-view {
    .top-name {
      color: #3e3c3c7a;
      text-align: left;
      overflow: hidden;
      max-width: 200px;
      min-width: 20px;
      margin-bottom: 2px;
    }
    .message-wrap {
      & > div:active {
        background: #9EEA6A;
      }
    }
    .emotion-img {
      width: 24px;
      height: 24px;
    }
    .message-video {
      .video {
        border-radius: 4px;
        width: 150px;
        background: #000;
      }
    }
    .chat-content {
      width: 100%;
      overflow: hidden;
      background: #f3f3f3;
      .mint-loadmore {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
      }
      .message-content {
        display: flex;
        margin-top: 10px;
      }
      .text-img {
        .preview-img {
          width: 150px;
          border-radius: 4px;
        }
      }
      .message-red-packet-left {
        position: relative;
        border-radius: 0.106667rem;
        background: orange;
        font-size: 0.4rem;
        color: #fff;
        text-align: right;
        display: inline-table;
        max-width: 300px;
        min-width: 200px;
        height: 70px;
        box-shadow: 1px 1px 1px 1px #efefef;
        .packet {
          padding-right: 12px;
        }
        .text {
          height: 40px;
          color: #fff;
          padding: 10px;
          i {
            color: red;
            font-size: 25px;
            float: right;
          }
        }
        .footer {
          margin-top: 8px;
          height: 25px;
          background: white;
          padding-right: 5px;
          color: #797979;
        }
        .arrow-org {
          width: 10px;
          height: 10px;
          background: orange;
          position: absolute;
          left: -2px;
          top: 10px;
          transform: rotate(45deg);
        }
      }
      .message-red-packet-right {
        position: relative;
        border-radius: 0.106667rem;
        background: orange;
        font-size: 0.4rem;
        color: #fff;
        text-align: left;
        display: inline-table;
        max-width: 300px;
        min-width: 200px;
        height: 70px;
        box-shadow: 1px 1px 1px 1px #efefef;
        .packet {
          padding-left: 12px;
        }
        .text {
          height: 40px;
          color: #fff;
          padding: 10px;
          i {
            color: red;
            font-size: 25px;
          }
        }
        .footer {
          margin-top: 8px;
          height: 25px;
          background: white;
          padding-left: 5px;
          color: #797979;
        }
        .arrow-org {
          width: 10px;
          height: 10px;
          background: orange;
          position: absolute;
          right: -2px;
          top: 10px;
          transform: rotate(45deg);
        }
      }
      .message-text {
        position: relative;
        border-radius: 4px;
        max-width: 280px;
        min-width: 27px;
        min-height: 30px;
        background: #9EEA6A;
        font-size: 15px;
        color: #000;
        padding: 8px 10px;
        text-align: left;
        box-shadow: 2px 1px 1px 1px #cccccc;
        display: inline-table;
        .message-dot {
          height: 8px;
          width: 8px;
          border-radius: 8px;
          background: red;
          position: relative;
          left: 55px;
          top: 10px;
        }
        span {
          word-break: break-all;
        }
        .arrow {
          width: 10px;
          height: 10px;
          background: #9EEA6A;
          position: absolute;
          left: -2px;
          top: 10px;
          transform: rotate(45deg);
        }
        .wrapper{
          white-space: pre-wrap;
        }
      }
      .message-time{
        color: #999;
        text-align: left;
        margin-top: 2px;
      }
      .message-time-owner{
         color: #999;
         text-align: right;
         margin-top: 2px;
       }
      .message-img {
        margin: 0 10px;
        width: 45px;
        height: 45px;
        border-radius: 10px;
      }
      .is-user {
        justify-content: flex-start;
        flex-direction: row-reverse;
        .message-text {
          background: #e2e2e2;
          color: #000;
        }
        .arrow {
          background: #e2e2e2;
          right: -4px;
          left: initial;
        }
      }
    }
    .add-box {
        height: 25%;
        overflow-x: hidden;
        overflow-y: auto;
        background: #f5f5f5;
        .add-item {
          width: 25%;
          margin-top: 10px;
          float: left;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          .upload-photo {
            position: absolute;
            opacity: 0;
            width: 60px;
            height: 60px;
            top: 0;
          }
          i {
            font-size: 24px;
            padding: 17px 18px;
            background: #fff;
            border-radius: 4px;
          }
          span {
            margin-top: 2px;
            color: #949494;
          }
        }
      }
      .emotion-box {
        height: 25%;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
        background: #e2e2e2;
        .img {
          width: 10%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          float: left;
          img {
            width: 24px;
            height: 24px;
            border: none;
          }
        }
        .cusEmotion {
          width: 15%;
          padding-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          float: left;
          position: relative;
          .upload-photo {
            position: absolute;
            opacity: 0;
            width: 60px;
            height: 60px;
            top: 0;
          }
          i {
            font-size: 26px;
            color: #000;
            padding: 7px;
          }
          img {
            width: 50px;
            height: 50px;
            border: none;
          }
        }
      }
      .emoticon-toolbar {
        height: 30px;
        background: #f5f5f5;
        i {
          display: flex;
          align-items: center;
          justify-content: center;
          float: left;
          font-size: 20px;
          margin-left: 8px;
          margin-top: -5px;
          height: 30px;
          width: 30px;
        }
        .action {
          background: white;
          border-radius: 5px;
        }
      }
      .footer-top {
        background: #f5f5f5;
        border-top: 1px solid #e6e6e6;
        padding: 0 10px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .msg-notice {
          position: fixed;
          bottom: 1.706667rem;
          right: 0.186667rem;
          background: white;
          height: 0.8rem;
          padding: 0.133333rem;
          border: 0.026667rem solid #dadada;
          color: #000;
          border-radius: 0.053333rem;
        }
        .card-users {
          display: block;
          position: fixed;
          bottom: 55px;
          background: white;
          left: 9px;
          width: 80%;
          border-radius: 10px;
          border: 1px solid #cccccc;
          overflow-y: scroll;
          box-shadow: 1px 1px 1px 1px #afafaf;
          height: 40%;
        }
        .new-msg-show {
          display: block;
          position: fixed;
          bottom: 1.706667rem;
          left: 0.186667rem;
          background: white;
          overflow: hidden;
          height: 0.8rem;
          padding: 0.133333rem;
          border: 0.026667rem solid #dadada;
          color: #000;
          border-radius: 0.053333rem;
        }
        .new-msg-hidden {
          display: none;
        }
        .send-btn {
          height: 30px;
          width: 40px;
          background: #26a2ff;
          color: #fff;
          text-align: center;
          line-height: 30px;
          border-radius: 4px;
        }
        .mint-field {
          height: 60%;
          width: 72%;
          border-radius: 4px;
          .mint-cell-wrapper {
            padding: 0 5px;
            background-image: none;
          }
        }
        .iconfont {
          font-size: 24px;
        }
      }
      .mint-cell {
        min-height: initial;
        .mint-cell-value {
          padding: 0;
        }
        div, .mint-field-core {
          height: 100%;
        }
        .mint-field-core {
          font-size: 13px;
          overflow: hidden;
          height: 70%;
          resize: none;
          padding: 0;
        }
        .mint-field-clear {
          display: flex;
          align-items: center;
        }
      }
  }
</style>
