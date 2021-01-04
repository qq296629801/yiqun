<template>
  <div class="login">
    <div class="login-header">
      Hi，欢迎来到易群！
    </div>
    <div class="login-form">
      <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
      <mt-field label="密码" type="password" placeholder="请输入密码" v-model="password">
      </mt-field>
      <mt-field label="验证码" placeholder="请输入验证码" v-model="checkCode">
        <valid-code v-model="code"></valid-code>
      </mt-field>
    </div>
    <div class="login-footer">
      <mt-button class="submit-btn" size="small" type="primary" @click="handleLogin" @keyup.enter.native="handleLogin">登录</mt-button>
      <!--<mt-button class="submit-btn" size="small" type="default" @click="handleRegister">注册</mt-button>-->
      <div class="footer-tips">登录即表示同意<span>《易群用户协议》</span> <i @click="handleForget">忘记密码?</i></div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import ValidCode from '@/components/ValidCode'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Login',
  components: { ValidCode },
  data () {
    const loginAuth = localStorage.getItem('login')
    return {
      loginAuth: (loginAuth && JSON.parse(loginAuth)) || null,
      randomCheckCode: null,
      checkCode: null,
      password: '',
      phone: null,
      sending: false,
      timer: null,
      count: 60,
      username: '',
      getLocation: '',
      getNetworkType: '',
      code: '',
      image: '',
      download: {}
    }
  },
  mounted () {
    if (this.loginAuth !== null) {
      this.username = this.loginAuth.username
      this.password = this.loginAuth.password
    }
  },
  methods: {
    ...mapMutations({
      setToken: 'store/setToken'
    }),
    ...mapGetters({
      getToken: 'store/getToken'
    }),
    handleForget () {
      this.$router.push('/forget').then()
    },
    handleRegister () {
      this.$router.push('/register').then()
    },
    handleLogin () {
      if (this.checkCode.toLowerCase() === this.code.toLowerCase()) {
        if (this.username === '' || this.password === '') {
          Toast('用户账号为空')
          return
        }
        this.$socket.login(this.username, this.password, this.checkCode, (res) => {
          if (res.success) {
            let login = {
              username: this.username,
              password: this.password
            }
            localStorage.setItem('login', JSON.stringify(login))
            localStorage.setItem('user', JSON.stringify(res.user))
            this.$cookies.set('login', JSON.stringify(login))
            this.$router.push('/chatList').then()
            localStorage.setItem('token', res.token)
          } else {
            Toast(res.reason)
          }
        })
      } else {
        Toast('验证码有误')
      }
    }
  }
}
</script>

<style lang="less">
  .login {
    .login-header {
      height: 160px;
      background: #fff;
      padding-left: 30px;
      text-align: left;
      line-height: 160px;
      font-weight: bold;
      font-size: 18px;
    }
    .login-form{

    }
    .send-btn {
      width: 100px;
    }
    .login-footer {
      padding-top: 30px;
    }
    .downloadPage{
      width: 100%;
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: center;
      justify-content: center;
      margin-top: 30px;
    }
    .item{
      float: left;
      margin-right: 20px;
    }
    .item span{
      color: #999999;
    }
  }
</style>
