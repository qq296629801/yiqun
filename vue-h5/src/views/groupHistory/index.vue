<template>
  <div class="group-history">
    <mt-search class="search-box" v-model="value"></mt-search>
    <div class="group-history-body">
      <template v-for="(item, i) in list">
        <chat-item :item="item" :key="i"></chat-item>
      </template>
      <div class="group-chat-num">{{value?`搜索：${value}`:'查找聊天内容'}}</div>
    </div>
  </div>
</template>
<script>
import ChatItem from '@/components/ChatItem'
export default {
  name: 'GroupHistory',
  components: { ChatItem },
  data () {
    const user = localStorage.getItem('user')
    const item = localStorage.getItem('groupChatItem')
    return {
      pageNum: -1,
      user: (user && JSON.parse(user)) || null,
      item: (item && JSON.parse(item)) || {},
      value: null,
      list: [],
      dataList: []
    }
  },
  watch: {
    value (val) {
      this.getGroupMessages(val)
    }
  },
  mounted () {
  },
  methods: {
    getGroupMessages (condition) {
      this.$socket.getGroupMessageByCondition(this.item.chatId, this.user.id, this.pageNum, condition, (res) => {
        this.list = []
        res.messageList.forEach(value => {
          let chat = {
            imgUrl: value.avatar,
            unreadNumber: 0,
            content: value.msgContext,
            chatName: (value.groupNickName || value.userName) + ':' + value.msgContext,
            lastOpenTime: this.$moment(value.operTime).format('yyyy-MM-dd hh:mm')
          }
          this.list.push(chat)
          console.log(value)
        })
      })
    }
  }
}
</script>
<style lang="less">
  .group-history {
    height: 100%;
    background: #fff;
    .group-chat-num {
      background: #fff;
      text-align: center;
      font-size: 12px;
      color: #748EAC;
      padding: 17px 0;
    }
    .group-chat-item {
      border-bottom: 1px solid #ccc;
    }
    .group-history-body {
      height: 100%;
      background: #fff;
    }
  }
</style>
