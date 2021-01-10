<template>
	<view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<emotion @addEmoji="addEmoji" @send="sendMsg(0,textMsg)" :class="{hidden:hideEmoji}"></emotion>
			
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{hidden:hideMore}">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<image class="box-xx" src="../../static/img/more/tupian.png"></image>
					</view>
					<view class="box" @tap="camera">
						<image class="box-xx" src="../../static/img/more/paizhao.png"></image>
					</view>
					<view class="box" @tap="redenvelopeFlag = true">
						<image class="box-xx" src="../../static/img/more/hongbao.png"></image>
					</view>
					<view class="box" @tap="weizhi">
						<image class="box-xx" src="../../static/img/more/weizhi.png"></image>
					</view>
					<!-- <view class="box">
						<image class="box-xx" src="../../static/img/more/yuyintonghua.png"></image>
					</view>
					
					<view class="box">
						<image class="box-xx" src="../../static/img/more/yuyinshuru.png"></image>
					</view>
					<view class="box">
						<image class="box-xx" src="../../static/img/more/me-shouchang.png"></image>
					</view>
					<view class="box">
						<image class="box-xx" src="../../static/img/more/userinfo.png"></image>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 抽屉参数
				popupLayerClass:'',
				inputOffsetBottom: 0, //键盘的高度
				viewOffsetBottom: 0, //视窗距离页面的距离
			};
		},
		methods:{
			discard(){
				return;
			}
		}
	}
</script>

<style lang="less">

</style>
