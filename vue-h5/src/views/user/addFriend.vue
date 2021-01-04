<template>
  <div class="add-friend">
    <mt-index-list>
      <template v-for="(item, i) in userList">
        <mt-cell :title="item.nickName" :key="i">
          <img slot="icon" :src="`${$url}/${item.avatar}`" alt=""/>
          <div>
            <mt-button class="accept" v-show="isShow" slot="right" @click="handleAccept(item.id)">接受</mt-button>
            <mt-button class="refuse" v-show="isShow" slot="right" @click="handleRefuse(item)">拒绝</mt-button>
          </div>
        </mt-cell>
      </template>
    </mt-index-list>
  </div>
</template>

<script>
export default {
  name: 'addFriend',
  data () {
    const user = localStorage.getItem('user')
    const storage = localStorage.getItem('contacts')
    return {
      user: (user && JSON.parse(user)) || null,
      list: (storage && JSON.parse(storage)) || [],
      search: [],
      userList: [],
      isShow: true
    }
  },
  watch: {},
  methods: {
    queryFriendRequest () {
      this.$socket.queryFriendRequestList(this.user.id, res => {
        if (res.success) {
          this.userList = res.userList
        }
      })
    },
    handleAccept (friendId) {
      this.$socket.AcceptFriendRequest(friendId, this.user.id, res => {
        if (res.success) {
          this.userList.remove()
        }
      })
    },
    handleRefuse () {
      this.userList.remove()
    }
  },
  mounted () {
    this.queryFriendRequest()
  }
}
</script>

<style lang="less">
  .add-friend {
    .icon-black {
      color: black;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 5px;
      margin-right: 0.426667rem;
    }
    i {
      width: 30px;
      height: 30px;
      border-radius: 5px;
      color: #258ad6;
      padding: 3px;
    }
    .refuse {
      background-color: #FF6464;
    }
    .accept {
      background-color: springgreen;
    }
  }
</style>
