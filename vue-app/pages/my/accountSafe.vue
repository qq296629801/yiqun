<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="false" title=" " :background="{ background: '#ffffff'  }" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="status_bar"></view>
		<!-- #endif -->
		<u-cell-group>
			<u-cell-item title="微信号" :value="userData.user.username" :title-style="{ marginLeft: '10rpx' }">
			</u-cell-item>
			<u-cell-item title="手机号" :value="userData.user.mobile" :title-style="{ marginLeft: '10rpx' }">
			</u-cell-item>
		</u-cell-group>
		<!--<view  style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item title="安全中心" :title-style="{ marginLeft: '10rpx' }">
			</u-cell-item>
		</u-cell-group>-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
				src1:require('@/static/qrcode.png'),
				groupList: [
					{ title: '新消息通知', color: '#409eff', icon: 'star' },
					{ title: '隐私', color: '#409eff', icon: 'photo' },
					{ title: '通用', color: '#409eff', icon: 'coupon' },
					{ title: '帮助与反馈', color: '#ff9900', icon: 'heart' }
				],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
</style>
