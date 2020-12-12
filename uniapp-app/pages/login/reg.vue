<template>
  <view class="content">
    <view class="header">
      <image src="../../static/shilu-login/logo.png"></image>
    </view>

    <view class="list">
      <view class="list-call">
		<view class="iconfont iconphone" style="font-size: 20px;color: #E4E6F3;"></view>
        <input class="sl-input" v-model="phone" type="number" maxlength="11" placeholder="手机号" />
      </view>
      <view class="list-call">
        <view class="iconfont iconmima1" style="font-size: 20px;color: #E4E6F3;"></view>
        <input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="登录密码" :password="!showPassword" />
        <image class="img" :src="showPassword?'/static/shilu-login/op.png':'/static/shilu-login/cl.png'" @tap="display"></image>
      </view>
      <view class="list-call">
       <view class="iconfont iconyanzhengyanzhengma" style="font-size: 17px;color: #E4E6F3;"></view>
        <input class="sl-input" v-model="code" type="number" maxlength="4" placeholder="验证码" />
        <view class="yzm" :class="{ yzms: second>0 }" @tap="getcode">{{yanzhengma}}</view>
      </view>
    </view>

    <view class="button-login" hover-class="button-hover" @tap="bindLogin">
      <text>注册</text>
    </view>

    <view class="agreement">
      <image @tap="agreementSuccess" :src="agreement==true?'/static/shilu-login/ty1.png':'/static/shilu-login/ty0.png'"></image>
      <text @tap="agreementSuccess"> 同意</text>
      <navigator url="agreement?id=1" open-type="navigate">《软件用户协议》</navigator>
    </view>
  </view>
</template>

<script>
  var _this, js;
  export default {
    onLoad() {
      _this = this;

    },
    onUnload() {
      clearInterval(js)
      this.second = 0;
    },
    data() {
      return {
        phone: '',
        password: '',
        code: '',
        invitation: '',
        agreement: true,
        showPassword: false,
        second: 0
      };
    },
    computed: {
      yanzhengma() {
        if (this.second == 0) {
          return '获取验证码';
        } else {
          if (this.second < 10) {
            return '重新获取0' + this.second;
          } else {
            return '重新获取' + this.second;
          }
        }
      }
    },
    onUnload() {
      this.clear()
    },
    methods: {
      clear(){
        clearInterval(js)
        js = null
        this.second = 0
      },
      display() {
        this.showPassword = !this.showPassword
      },
      agreementSuccess() {
        this.agreement = !this.agreement;
      },
      getcode() {
        if (this.phone.length != 11) {
          uni.showToast({
            icon: 'none',
            title: '手机号不正确'
          });
          return;
        }
        if (this.second > 0) {
          return;
        }
        this.second = 60;
        //请求业务
        js = setInterval(function() {
          _this.second--;
          if (_this.second == 0) {
            _this.clear()
          }
        }, 1000)
        // uni.request({
        //   url: 'http://***/getcode.html', //仅为示例，并非真实接口地址。
        //   data: {
        //     phone: this.phone,
        //     type: 'reg'
        //   },
        //   method: 'POST',
        //   dataType: 'json',
        //   success: (res) => {
        //     if (res.data.code != 200) {
        //       uni.showToast({
        //         title: res.data.msg,
        //         icon: 'none'
        //       });
        //     } else {
        //       uni.showToast({
        //         title: res.data.msg
        //       });
        //       js = setInterval(function() {
        //         _this.second--;
        //         if (_this.second == 0) {
        //           _this.clear()
        //         }
        //       }, 1000)
        //     }
        //   },
        //   fail() {
        //     this.second == 0
        //   }
        // });
      },
      bindLogin() {
        if (this.agreement == false) {
          uni.showToast({
            icon: 'none',
            title: '请先阅读《软件用户协议》'
          });
          return;
        }
        if (this.phone.length != 11) {
          uni.showToast({
            icon: 'none',
            title: '手机号不正确'
          });
          return;
        }
        if (this.password.length < 6) {
          uni.showToast({
            icon: 'none',
            title: '密码不正确'
          });
          return;
        }
        if (this.code.length != 4) {
          uni.showToast({
            icon: 'none',
            title: '验证码不正确'
          });
          return;
        }
        uni.request({
          url: 'http://***/reg.html',
          data: {
            phone: this.phone,
            password: this.password,
            code: this.code,
            invitation: this.invitation
          },
          method: 'POST',
          dataType: 'json',
          success: (res) => {
            if (res.data.code != 200) {
              uni.showToast({
                title: res.data.msg,
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: res.data.msg
              });
              setTimeout(function() {
                uni.navigateBack();
              }, 1500)
            }
          }
        });

      }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .header {
    width: 161rpx;
    height: 161rpx;
    background: #fff;
    //box-shadow: 0rpx 12rpx 13rpx 0rpx #c7c7c7;
    border-radius: 10rpx;
    margin-top: 30rpx;
    margin-left: auto;
    margin-right: auto;
  }

  .header image {
    width: 161rpx;
    height: 161rpx;
    border-radius: 50%;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

  .list-call {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    color: #333333;
    border: 0.5px solid #E4E6F3;
	padding: 10px;
	margin-bottom: 10px;
	border-radius: 100px;
  }

  .list-call .img {
    width: 40rpx;
    height: 40rpx;
  }

  .list-call .sl-input {
    flex: 1;
    text-align: left;
    font-size: 32rpx;
    margin-left: 16rpx;
  }

  .yzm {
    color: #FF7D13;
    font-size: 24rpx;
    line-height: 64rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    width: auto;
    height: 64rpx;
    border-radius: 50rpx;
  }

  .yzms {
    color: #999999 !important;
    border: 1rpx solid #999999;
  }

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 630rpx;
    height: 100rpx;
    background: linear-gradient(-90deg, #79B1FF, #8C9CFF);
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    line-height: 100rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
  }

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }

  .agreement {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #FFA800;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }

  .agreement image {
    width: 40rpx;
    height: 40rpx;
  }
</style>
