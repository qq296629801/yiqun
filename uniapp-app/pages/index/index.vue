<template>
	<view class="content">
		<view class="status_bar"></view>
		<view class="content_body">
			<u-avatar src="/static/icon-40@3x.png" mode="square"></u-avatar>
			<view class="content_body_pswd">
				<u-cell-group>
					
					<u-field v-model="_login.userName" clearable type="text" label="用户名" placeholder="请填写用户名"></u-field>
					<u-field v-model="_login.passWord" clearable type="text" password label="密码" placeholder="请填写密码"></u-field>
				</u-cell-group>
				
			</view>
			<view class="read">
				<u-checkbox name="isRead" v-model="isRead">
					已阅读
					<span class="agreement" @click="handleToAgreement">《xxx协议》</span>
				</u-checkbox>
			</view>
			<view class="content_body_btn"><u-button :ripple="true" type="success" @click="doLogin">登录</u-button></view>
		</view>
		<view class=" u-flex u-row-around safe-area-inset-bottom content_footer">
			<text>找回密码</text>
			<text @tap="clickSheet">更多选项</text>
		</view>
		<u-action-sheet :list="list" @click="handleAction" v-model="show" border-radius="25" safe-area-inset-bottom></u-action-sheet>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			isRead: false,
			list: [
				{
					text: '切换账号',
					fontSize: '28'
				},
				{
					text: '注册',
					fontSize: '28'
				}
			]
		};
	},
	onLoad() {},
	onShow() {},
	methods: {
		handleAction (i) {
			if (i === 1) {
				this.$u.route({
					url: 'pages/register/register'
				})
			}
		},
		handleToAgreement () {
			this.$u.route({
				url: 'pages/agreement/agreement'
			})
		},
		clickSheet() {
			this.show = true;
		},
		doLogin() {
			this.$socket.login(this._login.userName, this._login.passWord, null,res=>{
				if (res.success) {
				    //this.$u.vuex('_user_info', res.response.data)
					// 缓存用户
					this.$u.vuex('_user_info', res.response.data)
					this.$u.vuex('_login',this._login)
					// 缓存通讯录
					this.$socket.listGuests(this._user_info.id, res => {
						this.$u.vuex('firendList', res.response.data)
					})
					//缓存链接
					this.$socket.getLinks(this._user_info.id, res=>{
						this.$u.vuex('links',res.response.data)
					});
					// 跳转到消息列表
					this.$u.route({
						url: 'pages/home/home',
						type: 'switchTab'
					});
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
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	overflow: hidden;
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	&_body {
		margin-top: 170rpx;
		text-align: center;
		&_tel {
			margin-top: 10rpx;
		}
		&_pswd {
			margin-top: 40rpx;
		}
		&_btn {
			margin-top: 120rpx;
			padding: 0 20rpx;
		}
	}
	&_footer {
		position: absolute;
		bottom: 50rpx;
		width: 100%;
		padding: 0 30rpx;
		text {
			color: #2979ff;
		}
	}
	.read {
		text-align: center;
		margin-top: 40rpx;
	}
	.agreement {
		color: red;
	}
}
</style>
<style scoped>
>>> .u-border-top:after {
	border-top-width: 0px;
}
</style>
