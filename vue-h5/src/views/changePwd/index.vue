<template>
  <div class="change-password">
    <mt-header fixed :title="'修改密码'">
      <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
      <mt-button slot="right" @click="handUserUpdate">保存</mt-button>
    </mt-header>
    <mt-field placeholder="请输入旧密码" v-model="oldpwd"></mt-field>
    <mt-field placeholder="请输入新密码" v-model="newpwd"></mt-field>
  </div>
</template>
<script>
export default {
  name: 'ChangePwd',
  data () {
    const user = localStorage.getItem('user')
    return {
      newpwd: '',
      oldpwd: '',
      user: (user && JSON.parse(user)) || {}
    }
  },
  mounted () {
  },
  methods: {
    handUserUpdate () {
      this.$socket.updatePassword(this.user.id, this.user.userName, this.newpwd, res => {
        if (res.success) {
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style lang="less">
  .change-password {
    .mint-cell-wrapper {
      height: 50px;
    }
  }
</style>
