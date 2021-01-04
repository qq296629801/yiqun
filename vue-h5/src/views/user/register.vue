<template>
  <div class="user">
    <div class="form">
      <mt-field label="手机号" placeholder="请输入手机号" v-model="user.phone"></mt-field>
      <mt-field label="昵称" placeholder="请输入昵称" v-model="user.nickname"></mt-field>
      <mt-field label="密码" type="password" placeholder="请输入密码" v-model="user.password"></mt-field>
      <mt-field label="确认密码" type="password" placeholder="请输入密码" v-model="password2"></mt-field>
      <mt-field label="验证码" placeholder="请输入验证码" v-model="user.smsCode">
        <span v-show="show" @click="sendSmsCode">获取验证码</span>
        <span v-show="!show">{{time+'秒后获取'}}</span>
      </mt-field>
    </div>
    <div class="submit">
      <mt-button size="small" type="primary" @click="handleRegister">注册</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  name: 'register',
  comments: { Toast },
  data () {
    return {
      password2: '',
      user: {
        phone: '',
        smsCode: '',
        password: '',
        nickname: '',
        uuid: ''
      },
      show: true,
      time: '',
      timer: null,
      isNetwork: true
    }
  },
  methods: {
    handleRegister () {
      if (this.user.phone === '' || this.user.smsCode === '' || this.user.password === '' || this.user.nickname === '' || this.password2 === '') {
        Toast('信息请填写完整')
        return
      }
      if (this.user.password === '' || this.password2 === '') {
        Toast('密码不能为空')
        return
      }
      if (this.user.password !== this.password2) {
        Toast('密码不一致')
        return
      }
      var myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if (!myreg.test(this.user.phone)) {
        Toast('手机号码格式错误')
        return
      }
      if (this.isNetwork) {
        this.isNetwork = false
        this.$socket.register(this.user, res => {
          if (res.success) {
            this.$router.push('/login').then()
          } else {
            Toast('注册失败')
          }
          this.isNetwork = true
        })
      }
    },
    countdown () {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.time = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.time > 0 && this.time <= TIME_COUNT) {
            this.time--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    sendSmsCode () {
      this.$socket.randomSmsCode(this.user.phone, res => {
        var myreg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
        if (!myreg.test(this.user.phone)) {
          Toast('手机号码格式错误')
          return
        }
        if (res.success) {
          this.user.uuid = res.uuid
          this.countdown()
        }
      })
    }
  }
}
</script>

<style lang="less">
  .user {
    margin-top: 10px;
    .submit {
      height: 160px;
      background: #fff;
      text-align: center;
      line-height: 100px;
      line-width: 470px;
    }
  }
</style>
