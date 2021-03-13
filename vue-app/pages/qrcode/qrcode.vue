<template>
	<view class="content">
		<view style="margin-top: 200rpx;margin-left: auto;margin-right: auto;width: 630rpx;">
			<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
				<view class="u-m-r-10">
					<u-avatar :src="`${$url}/${userData.user.avatar}`" size="140"></u-avatar>
				</view>
				<view class="u-flex-1">
					<view class="u-font-18 u-p-b-20">{{userData.user.realname}}</view>
					<view class="u-font-14 u-tips-color">积分: {{userData.user.money}}</view>
				</view>
			</view>
			<view class="u-flex">
				<view class="u-m-r-10">
					<image :src="createQRCode(userData.user.operId, 80)"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import QR from '@/components/wxqrcode.js'
	export default {
		data() {
			return {
			};
		},
		methods:{
			  createQRCode: function (text, size) {
			    //调用插件中的draw方法，绘制二维码图片
			    let that = this
			    try {
			      let _img = QR.createQrCodeImg(text, {
			        size: parseInt(size)
			      })
				  return _img;
			    } catch (e) {
			      console.warn(e)
			    }
			  }
		}
	}
</script>

<style lang="scss">
.content{
}
</style>
