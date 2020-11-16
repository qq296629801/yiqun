<template>
	<view class="register">
		<view class="user-pw">
			<u-cell-group>
				<u-field v-model="register.userName" clearable type="text" label="用户名" placeholder="请填写用户名"></u-field>
				<u-field v-model="register.passWord" clearable type="text" password label="密码" placeholder="请填写密码"></u-field>
			</u-cell-group>
			</u-radio-group>
		</view>
		<view class="is-read">
			<u-checkbox v-model="register.isRead" name="isRead">
				已阅读
				<span class="agreement" @click="handleToAgreement">《xxx协议》</span>
			</u-checkbox>
		</view>
		<view class="register-btn">
			<u-button :ripple="true" type="success" @click="handleRegister">注册</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				register: {
					userName: '',
					passWord: '',
					isRead: false
				}
			}
		},
		methods: {
			handleRegister () {},
			handleToAgreement () {
				this.$u.route({
					url: 'pages/agreement/agreement'
				})
			}
		}
	}
</script>

<style lang="scss">
	.register {
		/deep/.u-cell-item-box {
			background: none;
		}
		.is-read {
			text-align: right;
		}
		.user-pw {
			margin-top: 80rpx;
			margin-bottom: 20rpx;
		}
		.register-btn {
			margin-top: 80rpx;
		}
		.agreement {
			color: red;
		}
	}
</style>
