<template>
  <view class="content">
    <view class="header">
      <image :src="logo"></image>
    </view>
    <view class="list">
      <view class="list-call">
        <view class="iconfont iconshoujihao" style="font-size: 20px;color: #E4E6F3;"></view>
        <input class="sl-input" v-model="phone" type="text" maxlength="11" placeholder="输入手机号" />
      </view>
      <view class="list-call">
        <view class="iconfont iconmima1" style="font-size: 20px;color: #E4E6F3;"></view>
        <input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="输入密码" password="true" />
		<image class="img" :src="showPassword?op:cl" @tap="display"></image>
      </view>
    </view>
    <view class="button-login" hover-class="button-hover" @tap="doLogin()">
      <text>登录</text>
    </view>
    <view class="agreenment">
      <navigator url="forget" open-type="navigate">忘记密码</navigator>
      <text>|</text>
      <navigator url="reg" open-type="navigate">注册账户</navigator>
    </view>
  </view>
</template>

<script>
	import { openFSqlite, createFSQL, selectFSQL, addFSQL } from '../../util/f.js'
  export default {
    data() {
      return {
		op:'/static/shilu-login/op.png',
		cl:'/static/shilu-login/cl.png',
        logo:'../../static/shilu-login/logo.png',
        phone: '',
        password: '',
		showPassword: false,
		indexList: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      };
    },
	onShow() {
		// #ifndef H5
		openFSqlite().then();
		// #endif
	},
    methods: {
		display() {
		  this.showPassword = !this.showPassword
		},
		doLogin() {
			this.$socket.login(this.phone, this.password, null,res=>{
				if (res.success) {
					// 缓存用户
					this.$u.vuex("userData",res.response.data);
					// 	缓存通讯录
					this.$socket.listGuests(this.userData.user.operId, res => {
						// #ifndef H5
						createFSQL(this.userData.user.operId).then();
						res.response.data.forEach(f=>{
							f.members.forEach(o=>{
								o.name = f.name;
								addFSQL(o,this.userData.user.operId).then();
							})
						})
						// #endif
						this.$u.vuex('firendList', res.response.data)
					})
					//	缓存链接
					this.$socket.getLinks(this.userData.user.operId, res=>{
						this.$u.vuex('links',res.response.data)
					});
					// 跳转到消息列表
					this.$u.route({
						url: 'pages/home/home',
						type: 'switchTab'
					});
				} else {
				  uni.showModal({
				  	title:res.reason + "，请稍后再试",
				  	showCancel:false
				  })
				}
			})
		},
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
    background: #ffffff;
   // box-shadow: 0rpx 12rpx 13rpx 0rpx #79B1FF;
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
  }

  .agreenment {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #8C9CFF;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }

  .agreenment text {
    font-size: 24rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
  }
</style>
