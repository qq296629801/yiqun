<template>
  <div class="fix-name">
    <mt-header fixed :title="$route.params.method === '2'?'编辑名称':'编辑昵称'">
      <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
      <mt-button slot="right" @click="handUserUpdate">保存</mt-button>
    </mt-header>
    <mt-field placeholder="请输入名称" v-model="name"></mt-field>
    <div class="footer-tips">在这里可以设置名称</div>
  </div>
</template>
<script>
export default {
  name: 'EditName',
  data () {
    const user = localStorage.getItem('user')
    const groupInfo = localStorage.getItem('groupInfo')
    return {
      groupInfo: (user && JSON.parse(groupInfo)) || {},
      user: (user && JSON.parse(user)) || null,
      name: '',
      method: 0
    }
  },
  mounted () {
    this.method = this.$route.params.method
    this.name = this.method === '0' ? this.user.nickName : this.method === '1' ? this.groupInfo.groupNickName : this.groupInfo.groupName
  },
  methods: {
    handUserUpdate () {
      if (this.method === '1') {
        this.$socket.updateGroupNick(this.user.id, this.groupInfo.id, this.name, (res) => {
          if (res.success) {
            this.$router.go(-1)
          }
        })
      } else if (this.method === '2') {
        this.$socket.updateGroupName(this.user.id, this.groupInfo.id, this.name, (res) => {
          if (res.success) {
            this.$router.go(-1)
          }
        })
      } else {
        this.$socket.updateNickName(this.user.id, this.name, (res) => {
          if (res.success) {
            localStorage.setItem('user', JSON.stringify(res.user))
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>
<style lang="less">
  .fix-name {
    margin-top: 10px;
    .mint-cell-wrapper {
      height: 50px;
    }
  }
</style>
