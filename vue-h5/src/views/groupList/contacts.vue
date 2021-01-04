<template>
  <div class="cc">
    <mt-header fixed title="联系人">
      <mt-button slot="right" @click="handleScanQrCode">
        <mt-cell>
          <i slot="icon" class="iconfont icon-saoyisao icon-black"></i>
        </mt-cell>
      </mt-button>
    </mt-header>
    <div class="chat-list">
      <mt-index-list>
        <mt-search class="search-box" v-model="chatName"></mt-search>
        <mt-cell title="新朋友" to="/addFriend">
          <i slot="icon" class="iconfont icon-gerenxinxi icon-org"></i>
        </mt-cell>
          <mt-cell title="添加朋友" to="/newFriend">
          <i slot="icon" class="iconfont icon-gerenxinxi icon-org"></i>
        </mt-cell>
        <mt-cell title="群组" to="/groupList">
          <i slot="icon" class="iconfont icon-tongxunlu"></i>
        </mt-cell>
        <template v-for="(item, i) in list">
          <mt-index-section :index="item.name" v-bind:key="i" v-if="item.members.length>0">
            <template v-for="(u, i) in item.members">
              <mt-cell :title="u.groupNickName" :key="i" @click.native.capture="handOpenChat(u)">
                <img slot="icon" :src="`${$url}/${u.avatar}`" alt=""/>
              </mt-cell>
            </template>
          </mt-index-section>
        </template>
      </mt-index-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contact',
  data () {
    const user = localStorage.getItem('user')
    const storage = localStorage.getItem('contacts')
    return {
      popupForwardVisible: true,
      popupVisible: '',
      user: (user && JSON.parse(user)) || null,
      chatName: '',
      list: (storage && JSON.parse(storage)) || [],
      search: []
    }
  },
  watch: {
    chatName (val) {
      if (val === '') {
        this.queryGuests()
      } else {
        for (let i in this.search) {
          let members = this.search[i].members
          for (let j in members) {
            if (!members[j].nickName.includes(val)) {
              this.search.splice(i, 1)
            }
          }
        }
        this.list = this.search
      }
    }
  },
  methods: {
    handleScanQrCode () {
      this.$router.push('/scanQrCode').then()
    },
    handOpenChat (u) {
      localStorage.setItem('friendChatItem', JSON.stringify(u))
      this.$router.push('/friendChat').then()
    },
    queryGuests () {
      this.$socket.listGuests(this.user.id, res => {
        this.list = res.response.data
        this.search = this.list
        localStorage.setItem('contacts', JSON.stringify(res.response.data))
      })
    }
  },
  mounted () {
    this.queryGuests()
  }
}
</script>

<style lang="less">
  .cc {
    .icon-org {
      color: orange;
    }
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
    .mint-indexsection {
      text-align: left;
    }
  }
</style>
