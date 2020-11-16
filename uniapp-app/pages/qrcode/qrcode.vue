<template>
	<view style="display: flex;justify-content: center;">
		<image style="margin-top: 50rpx;" :src="createQRCode(_user_info.id, 130)"></image>
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

</style>
