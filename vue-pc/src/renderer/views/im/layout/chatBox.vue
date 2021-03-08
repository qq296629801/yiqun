<template>
  <div class="chat-panel">
    <div class="chat-box-list">
      <Input clearable prefix="ios-search" clearable v-model="search" placeholder="搜索" size="small" class="search"/>
      <div class="group-box">
        <ul class="user-list">
          <li class="user" v-for="(item, index) in items">
            <a href="javascript:" @click="showChat(item)" :class="chat&&chat.chatId===item.chatId?'active':''">
              <i v-if="item.unreadNumber !== 0">{{ getNum(item.unreadNumber) }}</i>
              <img :src="`${$url}/${item.imgUrl}`" alt="" />
              <b>{{ item.chatName }}</b>
              <p v-if="item.msgType==0">{{item.content}} {{ item.lastOpenTime | dateFormat }}</p>
              <p v-else>{{messageStr[item.msgType]}} {{ item.lastOpenTime | dateFormat }}</p>
            </a>
            <Icon type="md-close" @click="delChat(item.id)"></Icon>
          </li>
        </ul>
      </div>
    </div>
    <div class="chat-box">
      <Top></Top>
      <Chat v-if="chat" @showChat="showChat"></Chat>
      <Welcome v-else></Welcome>
    </div>
  </div>
</template>
<script>
import Top from '../components/top.vue';
import Chat from '../components/chat.vue';
import Welcome from '../components/welcome.vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    mapState
} from 'vuex';
moment.locale('zh-cn');
export default {
  components: {
    Top,
    Chat,
    Welcome
  },
  data() {
    return {
      search: '',
      user: this.$store.state.user,
      messageStr: ['文字', '图片', '表情', '语音', '视频', '签到', '撤销', '发红包', '抢红包'],
      items: this.$store.state.chatList
    };
  },
  watch: {
    search (val) {
      const list = this.$store.state.chatList
      this.items = val ? list.filter(item => item.chatName.includes(val)) : list
    }
  },
  computed: {
      ...mapState(['message_flush']),
      chat: {
          get: function() {
              return this.$store.state.chat;
          },
          set: function(chat) {
              this.$store.commit('setChat', chat);
          }
      },
      chatType: {
          get: function() {
              return this.$store.state.chatType;
          },
          set: function(chatType) {
              this.$store.commit('setChatType',chatType);
          }
      },
      chatList:{
          get:function () {
              return this.$store.state.chatList;
          },
          set:function (chatList) {
              this.$store.commit('setChatList',chatList);
              this.items = chatList;
          }
      }
  },
  methods: {
    showChat: function(item) {
        this.chat = item
        this.chatType = item.chatType
        this.findChatList()
    },
    showSearchChat: function(chat) {
    },
    delChat(chatId) {
        let self = this
        this.$socket.deleteChatById(this.user.operId, chatId, (res) => {
            if(res.success)
              self.findChatList()
        })
    },
    getNum (num) {
        return num <= 100 ? num : '99+'
    },
    findChatList(){
        let self = this
        console.log(this.user,'-----1----')
        this.$socket.chats('', this.user.operId, (res) => {
            console.log(res)
            console.log(this.user,'----2-----')
            if (res.success) {
                let arr = res.chats
                let total = 0
                if (arr.length > 0) {
                    for (let i = 0; i < arr.length; i++) {
                        total = total + arr[i].unreadNumber
                    }
                    self.chatList = arr
                }
                this.listLength = total
            }
        });
    }
  },
  filters: {
    dateFormat(val) {
      return moment(Number(val)).calendar();
    }
  },
  created() {
    this.findChatList()
  },
  activated: function() {
  },
  mounted: function() {}
};
</script>
<style lang="scss" scoped>
@import '../../../../../static/styles/theme';

.ivu-tabs-content {
  height: 100%;
}

.search {
  margin: 30px 20px;
  width: calc(100% - 40px);
}

.chat-panel {
  width: 26rem;
  background-color: $color-light-gray;
  height: 100%;
  display: flex;
  flex-direction: row;

  .chat-box {
    flex: 1;
    background-color: $color-box-bg;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .chat-box-list {
    height: 100%;
    width: 22rem;
    display: flex;
    flex-direction: column;

  }
}

.group-box {
  height: 100%;
  overflow: auto;

  .count {
    color: #aaaaaa;
  }

  li {
    list-style: none;
    position: relative;
    font-size: 1.2rem;
    cursor: pointer;
    font-weight: 200;

    h5 {
      padding: 0.5rem 0;
      cursor: pointer;
      font-size: 1.3rem;
      font-weight: 200;

      i {
        vertical-align: baseline;
      }
    }

    img {
      width: 4.4rem;
      height: 4.4rem;
      position: absolute;
      top: 0.4rem;
      left: 2rem;
    }

    b {
      position: absolute;
      font-size: 1.3rem;
      left: 7.5rem;
      width: 12rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
      top: 0.6rem;
    }

    p {
      position: absolute;
      left: 7.5rem;
      bottom: 0.4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 75%;
      font-size: 1.1rem;
      color: #aaaaaa;
    }
  }

  .user {
    height: 5.2rem;
    position: relative;

    a {
      display: block;
      width: 100%;
      height: 100%;
      color: $color-default;
      position: relative;

      i {
        display: inline-block;
        width: 1.8rem;
        height: 1.6rem;
        background-color: #ff0000;
        border-radius: 50%;
        color: $color-write;
        text-align: center;
        font-style: normal;
        position: absolute;
        left: 1rem;
        top: 0;
        z-index: 99999999999;
      }

      p {
        width: 12rem;
      }
    }

    &:hover {
      background-color: $color-gray !important;

      & > i {
        color: $color-default;
        background-color: $color-write;
      }
    }

    .active {
      background-color: $color-gray !important;
    }

    & > i {
      position: absolute;
      right: 1rem;
      bottom: 1.6rem;
      cursor: pointer;
      border-radius: 50%;
      padding: 0.2rem;
      text-align: center;
      color: $color-light-gray;

      &:hover {
        color: $color-default;
        background-color: $color-write;
      }
    }
  }
}
</style>
