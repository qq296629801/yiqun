<template>
  <div class="group-chat-index">
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <mt-search class="search-box" v-model="value"></mt-search>
      <div class="group-list-box">
        <template v-for="(item, i) in list">
          <group-chat-item :item="item" :key="i" @toChat="handleToChat(item)"></group-chat-item>
        </template>
      </div>
      <div class="goup-chat-num">{{list.length}}个群聊</div>
    </mt-loadmore>
  </div>
</template>
<script>
import GroupChatItem from '@/components/GroupChatItem'

export default {
  name: 'ChatList',
  components: { GroupChatItem },
  data () {
    const user = localStorage.getItem('user')
    let storageList = localStorage.getItem('groupList')
    return {
      user: (user && JSON.parse(user)) || null,
      value: null,
      list: (storageList && JSON.parse(storageList)) || []
    }
  },
  watch: {
    value (val) {
      this.query(val)
    }
  },
  mounted () {
    this.query('')
  },
  methods: {
    loadTop () {
      this.query('')
      this.$refs.loadmore.onTopLoaded()
    },
    query (val) {
      this.$socket.getGroups(val, this.user.id, (result) => {
        this.list = result.response.data
        localStorage.setItem('groupList', JSON.stringify(this.list))
      })
    },
    handleToChat (item) {
      this.$router.push('/groupChat')
      localStorage.setItem('groupChatItem', JSON.stringify(item))
    }
  }
}
</script>
<style lang="less">
  .group-chat-index {
    .mint-loadmore {
      height: 100%;
      overflow: auto;
    }
    // background: #fff;
    .goup-chat-num {
      background: #F6F7F8;
      text-align: center;
      font-size: 14px;
      color: #808080;
      padding: 17px 0;
    }
  }
</style>
