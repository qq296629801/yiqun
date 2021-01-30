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
					<view class="box" @tap="redShow">
						<image class="box-xx" src="../../static/img/more/hongbao.png"></image>
					</view>
					<view class="box" @tap="weizhi">
						<image class="box-xx" src="../../static/img/more/weizhi.png"></image>
					</view>
					<view class="box" @tap="weizhi">
						<image class="box-xx" src="../../static/img/more/yuyintonghua.png"></image>
					</view>
					<view class="box" @tap="weizhi">
						<image class="box-xx" src="../../static/img/more/yuyinshuru.png"></image>
					</view>
					<view class="box" @tap="weizhi">
						<image class="box-xx" src="../../static/img/more/me-shouchang.png"></image>
					</view>
					<view class="box" @tap="weizhi">
						<image class="box-xx" src="../../static/img/more/userinfo.png"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import emojiData from "../../static/emoji/emojiData.js"
	import emotion from '@/components/emotion/index.vue'
	export default {
		name:'im-drawer',
		components:{
			emotion
		},
		data() {
			return {
				inputOffsetBottom: 0, //键盘的高度
				viewOffsetBottom: 0, //视窗距离页面的距离
			};
		},
		props: {
			hideMore: {
				type: Boolean,
				default: true
			},
			hideEmoji: {
				type: Boolean,
				default: true
			},
			popupLayerClass: {
				type: String,
				default: ''
			},
			textMsg: {
				type: String,
				default: ''
			},
		},
		methods:{
			sendMsg(index,textMsg){
				this.$emit('sendMsg', index , textMsg);
			},
			redShow(){
				this.$emit('redShow', true);
			},
			weizhi(){
			},
			discard(){
				return;
			},
			getImage(type){
				this.$emit('getImage', type);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//添加表情
			addEmoji(em, del){
				this.$emit('addEmoji', em, del);
			},
		}
	}
</script>

<style lang="scss">
@import "@/pages/chat/style.scss";
</style>
