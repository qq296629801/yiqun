<template>
  <div class="new-friend">
    <mt-search v-model="value"></mt-search>
    <div>
      <mt-index-list>
        <template v-for="(item, i) in list">
          <mt-cell :title="item.nickName" :key="i">
            <img slot="icon" :src="`${$url}/${item.avatar}`" alt=""/>
            <div>
              <mt-button class="accept" slot="right" @click="sendFriendRequest(item.id)">添加到联系人</mt-button>
            </div>
          </mt-cell>
        </template>
      </mt-index-list>
    </div>
    <div v-show="!isShow">
      <span>查无此人</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newFriend',
  data: function () {
    const user = localStorage.getItem('user')
    return {
      value: '',
      user: (user && JSON.parse(user)) || null,
      isShow: false,
      result: [],
      list: []
    }
  },
  watch: {
    value (val) {
      console.log(val)
      this.getUser(val)
    }
  },
  methods: {
    getUser (val) {
      this.$socket.findUserByNickName(val, res => {
        console.log(res)
        if (res.success) {
          if (res.userList.length > 0) {
            this.list = res.userList
            console.log('查找成功')
            console.log(this.list)
          } else {
            this.isShow = true
          }
        }
      })
    },
    sendFriendRequest (friendId) {
      this.$socket.insertFriend(this.user.id, friendId, res => {
        console.log('发送成功')
        if (res.success) {
          this.$router.push('/contact').then()
        }
      })
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">
  .new-friend {
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

    .icon-black {
      color: black;
    }
    .accept {
      background-color: springgreen;
    }
  }
</style>
