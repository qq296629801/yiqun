<template>
  <div class="chat-index">
    <mt-header fixed title="聊天">
      <mt-button slot="right" @click="handleJumpChatGroup">
        <mt-cell>
          <i slot="icon" class="iconfont icon-addNew icon-black"></i>
        </mt-cell>
      </mt-button>
    </mt-header>
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <mt-search class="chat-list-search" v-model="chatName"></mt-search>
      <template v-for="(item, i) in list">
        <chat-item :item="item" :index="i" :key="i" @toChat="handleToChat(item)" @clear="handleClear"></chat-item>
      </template>
    </mt-loadmore>
  </div>
</template>
<script>
import ChatItem from '@/components/ChatItem'
import { mapMutations } from 'vuex'
export default {
  name: 'ChatList',
  components: { ChatItem },
  data () {
    const user = localStorage.getItem('user')
    const isCreate = localStorage.getItem('isCreate')
    const storageList = localStorage.getItem('chatList')
    return {
      chatName: '',
      user: (user && JSON.parse(user)) || null,
      isCreate: (isCreate && JSON.parse(isCreate)) || false,
      list: (storageList && JSON.parse(storageList)) || [],
      timer: null,
      val: ''
    }
  },
  watch: {
    chatName (val) {
      this.val = val
      if (val === '') {
        this.startCountdown()
      } else {
        this.stopCountdown()
      }
      this.handleRefresh()
    }
  },
  methods: {
    ...mapMutations({
      setListLength: 'store/setListLength'
    }),
    handleJumpChatGroup () {
      this.$router.push('/createGroup').then()
    },
    loadTop () {
      this.handleRefresh()
      this.$refs.loadmore.onTopLoaded()
    },
    handleClear (numId) {
      this.$socket.deleteChatById(this.user.id, numId, (res) => {
        this.handleRefresh()
      })
    },
    handleToChat (item) {
      localStorage.setItem(item.chatType === 1 ? 'groupChatItem' : 'friendChatItem', JSON.stringify(item))
      this.$router.push(item.chatType === 1 ? '/groupChat' : '/friendChat')
    },
    initData () {
      if (!this.isCreate && window.isApp) {
        this.$router.push('/loadMsg').then()
      }
    },
    handleRefresh () {
      this.$socket.chats(this.val, this.user.id, (res) => {
        if (res.success) {
          let arr = res.chats
          let total = 0
          if (arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              total = total + arr[i].unreadNumber
            }
            this.list = arr
            if (this.val !== '') {
              this.list = arr.filter(v => { return v.chatName.includes(this.val) })
            }
          }
          this.setListLength(total)
          localStorage.setItem('chatList', JSON.stringify(this.list))
        }
      })
    },
    stopCountdown () {
      window.clearInterval(this.timer)
      this.timer = null
    },
    startCountdown () {
      this.timer = window.setInterval(() => {
        this.handleRefresh()
      }, 1000)
    }
  },
  mounted () {
    this.initData()
    this.handleRefresh()
    this.startCountdown()
  },
  destroyed () {
    this.stopCountdown()
  }
}
</script>
<style lang="less">
  .chat-index {
    .mint-loadmore {
      height: 100%;
      overflow: auto;
    }
    .mint-search {
      height: auto;
      .mint-searchbar {
        background: #f6f7f8;
      }
    }
  }
</style>
