<template>
	<view>
		<!-- 底部输入栏 -->
		<view :style="{ bottom: inputOffsetBottom > 0 ?  '20rpx' : '0rpx' }" class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice">
				<view class="iconfont iconshuru" :class="isVoice?'iconshuru':'iconyuyin1'" @tap="switchVoice"></view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore">
				<view class="iconfont icontianjia"></view>
			</view>
			<!-- #endif -->
			<!-- 录音 -->
			<view class="textbox">
				<view class="voice-mode" :class="[isVoice?'':'hidden',recording?'recording':'']" @touchstart="voiceBegin"
				 @touchmove.stop.prevent="voiceIng" @touchend="voiceEnd" @touchcancel="voiceCancel">{{voiceTis}}</view>
				<view class="text-mode" :class="isVoice?'hidden':''">
					<view class="box">
						<textarea auto-height="true" v-on:change="Input" :disabled="disabledSay===1" v-model="textMsg" @focus="textareaFocus" />
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="iconfont iconbiaoqing"></view>
					</view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore">
				<view class="iconfont icontianjia"></view>
			</view>
			<!-- #endif -->
			<view class="send" @tap="sendMsg(0,textMsg)" :class="isVoice?'hidden':''">
				<view class="iconfont icontuiguang-weixuan"></view>
			</view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording?'':'hidden'">
			<view class="ing" :class="willStop?'hidden':''"><view class="icon luyin2" ></view></view>
			<view class="cancel" :class="willStop?'':'hidden'"><view class="icon chehui" ></view></view>
			<view class="tis" :class="willStop?'change':''">{{recordTis}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'footer-input',
		props: {
			recordTis:{
				type: String,
				default: ''
			},
			willStop:{
				type: Boolean,
				default: false
			},
			inputOffsetBottom: {
				type: Number,
				default: 0
			},
			isVoice: {
				type: Boolean,
				default: false
			},
			recording: {
				type: Boolean,
				default: false
			},
			disabledSay: {
				type: Number,
				default: 0
			},
			textMsg: {
				type: String,
				default: ''
			},
			popupLayerClass: {
				type: String,
				default: ''
			},
			voiceTis: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				
			};
		},
		methods:{
			textareaFocus(){
				this.$emit('textareaFocus', true);
			},
			// 选择表情
			chooseEmoji(){
				this.hideMore = true;
				if(this.hideEmoji){
					this.hideEmoji = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
			// 录音开始
			voiceBegin(e){
				if(e.touches.length>1){
					return ;
				}
				this.initPoint.Y = e.touches[0].clientY;
				this.initPoint.identifier = e.touches[0].identifier;
				this.RECORDER.start({format:"mp3"});//录音开始,
			},
			//录音开始UI效果
			recordBegin(e){
				this.recording = true;
				this.voiceTis='松开 结束';
				this.recordLength = 0;
				this.recordTimer = setInterval(()=>{
					this.recordLength++;
				},1000)
			},
			// 录音被打断
			voiceCancel(){
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.willStop = true;//不发送录音
				this.RECORDER.stop();//录音结束
			},
			// 录音中(判断是否触发上滑取消发送)
			voiceIng(e){
				if(!this.recording){
					return;
				}
				let touche = e.touches[0];
				//上滑一个导航栏的高度触发上滑取消发送
				if(this.initPoint.Y - touche.clientY>=uni.upx2px(100)){
					this.willStop = true;
					this.recordTis = '松开手指 取消发送'
				}else{
					this.willStop = false;
					this.recordTis = '手指上滑 取消发送'
				}
			},
			// 结束录音
			voiceEnd(e){
				if(!this.recording){
					return;
				}
				this.recording = false;
				this.voiceTis='按住 说话';
				this.recordTis = '手指上滑 取消发送'
				this.RECORDER.stop();//录音结束
			},
			//录音结束(回调文件)
			recordEnd(e){
				clearInterval(this.recordTimer);
				if(!this.willStop){
			      let tempFilePaths =e.tempFilePath;
				  let that=this;
					uni.uploadFile({
						url: this.$uploadUrl, //仅为示例，非真实的接口地址
						filePath: tempFilePaths,
						header: {
						'merchcode':'md5'
						},
						name: 'file',
						formData: {
							'user': 'test'
						},
						success: (res) => {
							let data =JSON.parse(res.data)
							let msg = {
								length:0,
								url:data.data
							}
							let min = parseInt(this.recordLength/60);
							let sec = this.recordLength%60;
							min = min<10?'0'+min:min;
							sec = sec<10?'0'+sec:sec;
							msg.length = min+':'+sec;
							this.sendMsg(3,JSON.stringify(msg))
						}
					});
				}else{
					// console.log('取消发送录音');
				}
				this.willStop = false;
			},
			//更多功能(点击+弹出)
			showMore(){
				this.isVoice = false;
				this.hideEmoji = true;
				if(this.hideMore){
					this.hideMore = false;
					this.openDrawer();
				}else{
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer(){
				this.$emit('openDrawer', true);
			},
			// 隐藏抽屉
			hideDrawer(){
				this.$emit('hideDrawer', true);
			},
		}
	}
</script>

<style lang="scss">
@import "@/pages/chat/style.scss";
</style>