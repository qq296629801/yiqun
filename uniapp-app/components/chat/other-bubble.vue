<template>
	<view>
		<!-- 别人发出的消息 -->
		<view class="other" v-if="row.sendUid!=_user_info.id">
			<!-- 右键 -->
			<view class="left-click" v-show="row.id==lClickId">
				<view @tap="copyFunc(row.msgContext)">复制</view>
				<view @tap="deleteFunc(row.id,index)" v-if="row.msgType!=1">删除</view>
				<view @tap="forwardFunc(row)" v-if="row.msgType!=7">转发</view>
				<view @tap="collectFunc(row)" v-if="row.msgType==1">收藏</view>
				<text @tap="rollBackFunc(row)">撤销</text>
			</view>
			<!-- 左-头像 -->
			<view :class="row.msgType==0?'left text':'left'" @tap="linkToCard(row.sendUid)">
				<img-cache :src="`${$url}/${row.avatar}`"></img-cache>
			</view>
			<!-- 右-用户名称-时间-消息 -->
			<view class="right">
				<view class="username">
					<view class="name">{{row.nickName}}</view>
					<view class="time">{{row.operTime|formatDate}}</view>
				</view>
				<!-- 文字消息 -->
				<view @longtap="lClickId = row.id" v-if="row.msgType==0" class="bubble">
					<rich-text :nodes="row.msgContext"></rich-text>
				</view>
				<!-- 语音消息 -->
				<view @longtap="lClickId = row.id" v-if="row.msgType==3" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id?'play':''">
					<view class="icon other-voice"></view>
					<view class="length">{{recordToJson(row.msgContext).length}}</view>
				</view>
				<!-- 图片消息 -->
				<view @longtap="lClickId = row.id" v-if="row.msgType==1" class="bubble img" @tap="showPic(`${$url}/${row.msgContext}`)">
					<image :src="`${$url}/${row.msgContext}`" style="width:100px;height:100px"></image>
				</view>
				<!-- 红包 -->
				<view v-if="row.msgType==7" @tap="openRedEnvelopeFunc(row,index)">
					<div class="message-red-packet-left" :style="redenvelopeProcess(row.msgContext).surplusMoney===0?'background:#F7DFC3':'background:#F09D47'">
						<div class="text">
						   <span class="packet">恭喜发财,大吉大利</span>
						   <image :src="redenvelopeProcess(row.msgContext).surplusMoney===0?'../../static/img/red-chai.png':'../../static/img/red.png'"></image>
						</div>
						<div :class="redenvelopeProcess(row.msgContext).surplusMoney===0?'footer2':'footer'">红包</div>
						<div class="arrow-org" :style="redenvelopeProcess(row.msgContext).surplusMoney===0?'background:#F7DFC3':'background:#F09D47'"></div>
					  </div>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'u-buble',
		components:{
		},
		props: {
			row: {
				type: Object,
				default() {
					return {};
				}
			},
			lClickId: {
				type: Boolean,
				default: false
			},
			playMsgid: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				
			};
		},
		methods:{
			// 打开红包
			openRedEnvelopeFunc(msg,index){
				this.windowsState = 'show'
				//获取最新的message
				this.message = msg
				// 从服务器获取最新包
				this.sendMsg(8, msg.id);
				// 解析红包数据
				this.packet = this.redenvelopeProcess(msg.msgContext)
			},
			//处理红包数据
			redenvelopeProcess(msgContext){
				let packets = JSON.parse(msgContext).Packets;
				let msg = {
						description:'好友暂不支持发红包',
						money:0,
						number:0,
						userAvatar:'defalut.jpg'
					}
				if(packets===undefined)
					return msg;
				return packets[0];
			},
			// 预览图片
			showPic(msg){
				uni.previewImage({
					indicator:"none",
					current: msg,
					urls: this.msgImgList
				});
			},
			// 播放语音
			playVoice(msg){
				let s =JSON.parse(msg.msgContext);
				this.playMsgid= msg.id;
				this.AUDIO.src = this.$url + s.url;
				this.$nextTick(function() {
					this.AUDIO.play();
				});
			},
			playMp3(){
				let s =JSON.parse(msg.msgContext);
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = this.$url + s.url;
				innerAudioContext.onPlay(() => {
				  console.log('开始播放');
				});
				innerAudioContext.onError((res) => {
				  console.log(res.errMsg);
				  console.log(res.errCode);
				});
			},
			recordToJson(msg){
				let s =JSON.parse(msg);
				return s
			},
			//复制
			copyFunc(content){
				uni.setClipboardData({
				data:content,
				success:()=>{
				  uni.showToast({
					title:"复制成功"
				  })
				}
			  });
			},
			//转发
			forwardFunc({msgType,msgContext}){
				this.$u.route({
					url:'pages/chat/forward',
					params:{msgType,msgContext}
				});	
			},
			//撤销
			rollBackFunc({id,operTime}){
				let _this = this
				uni.showActionSheet({
				    itemList: ['确认'],
				    success: function (res) {
				        if(res.tapIndex==0){
							let type = _this.chatObj.chatType;
							let arr = ['deleteFriendMsg','deleteGroupMsg']
							_this.$socket[arr[type]](_this._user_info.id, id, _this.chatObj.chatId, res => {
								if (res.success) {
								  _this.sendMsg(6, id)
								}
							})
						}
				    },
				    fail: function (res) {
				        console.log(res.errMsg);
				    }
				});
			},
			//名片
			linkToCard(id){
				this.$u.route({
					url: 'pages/businessCard/businessCard',
					params:{ id: id, source: 1}
				})
			},
			//表情转换
			transformFace(text){
				return transform(text)
			},
		}
	}
</script>

<style lang="scss">
@import "@/pages/chat/style.scss";
</style>
