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
					<view class="box">
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
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
		},
		methods:{
			redShow(){
				this.$emit('redShow', true);
			},
			weizhi(){
				uni.getLocation({
					type: 'wgs84 ',
					success: function (res) {
						Map.openMap(res.latitude, res.longitude, '易群', 'wgs84')
					}
				});
			},
			discard(){
				return;
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
				if (em.emoticonFlag){
					this.sendMsg(1,em.avatar);
				} else {
					//判断删除按钮
					if(del){
					  var str;
					  var msglen = this.textMsg.length - 1;
					  let start = this.textMsg.lastIndexOf("[");
					  let end = this.textMsg.lastIndexOf("]");
					  let len = end - start;
					  if(end != -1 && end === msglen && len >= 2 && len <= 4){
						    // 表情字符
							str = this.textMsg.slice(0, start);
						}else{
							// 普通键盘输入汉字 或者字符
							str = this.textMsg.slice(0, msglen);
						}
						
						this.textMsg = str
						return;
					}
					this.emojiList =emojiData.imgArr[em.groupIndex].emojiList
					this.emojiPath =emojiData.imgArr[em.groupIndex].emojiPath
					if(!em.minEmoji){
						this.sendBigEmoji(em.emojiItem.url)
					}else{
					  this.textMsg+=em.emojiItem.alt;
					}
				}
			},
			// 发送大表情
			sendBigEmoji(url){
				this.hideDrawer();//隐藏抽屉
				if(!url){
				    return;
				}
				let imgstr = '<img style="width:48px;height:48px;" src="'+ this.emojiPath + url +'">';
				let content = '<div style="align-items: center;word-wrap:break-word;">'
				             + imgstr
				             + '</div>';    
				let msg = {text:content}
				this.sendMsg(1, msg);
				//清空输入框
				this.textMsg = '';
			},
		}
	}
</script>

<style lang="scss">
@import "@/pages/chat/style.scss";
</style>
