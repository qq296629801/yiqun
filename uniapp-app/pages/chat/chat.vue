<template>
	<view>
		<view class="content" id="content" @touchstart="hideDrawer">
			<scroll-view id="scrollview" class="msg-list" :class="{'chat-h':popupLayerClass === 'showLayer'}" scroll-y="true"
			 :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory"
			 upper-threshold="50">
				<view id="msglistview" class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.id">
					<!-- 系统通知的消息 -->
					<system-bubble :row="row"></system-bubble>
					<!-- 自己发出的消息 -->
					<self-bubble :row="row" :rClickId="rClickId" :playMsgId="playMsgid"></self-bubble>
					<!-- 别人发出的消息 -->
					<other-bubble :row="row" :lClickId="lClickId" :playMsgid="playMsgid"></other-bubble>
				</view>
			</scroll-view>
		</view>
		
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
		
		<!-- 底部输入栏 -->
		<view :style="{ bottom: inputOffsetBottom > 0 ?  '15px' : '0' }" class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
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
		
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="from"><image :src="this.$url+packet.userAvatar"></image> {{packet.userName}} 的红包</view>
					<view class="blessing">恭喜发财，大吉大利</view>
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<view class="img">开</view>
					</view>
					<view class="showDetails" @tap="toDetails">
						      查看领取详情
					</view>
				</view>
			</view>
		</view>
		<!-- @功能 -->
		<view class="process" v-show="_call_s.length>0" @click="processFunc">
			<text>当前{{_call_s.length}}人@我</text>
		</view>
		<!-- 红包 -->
		<u-popup v-model="redenvelopeFlag" mode="bottom" length="70%">
			<redenvelope @handTo="redenvelopeFunc"></redenvelope>
		</u-popup>
	</view>
</template>
<script>
	import Map from '@/js_sdk/ms-openMap/openMap.js'
	import redenvelope from "@/components/redenvelope"
	import emotion from '@/components/emotion/index.vue'
	import emojiData from "../../static/emoji/emojiData.js"
	import { transform } from "../../static/emoji/ChatUtils.js"
	import { openMsgSqlite, createMsgSQL, selectMsgSQL, addMsgSQL } from '../../util/msg.js'
	import ImgCache from '@/components/img-cache/img-cache.vue';
	import SelfBubble from '@/components/chat/self-bubble.vue'
	import OtherBubble from '@/components/chat/other-bubble.vue'
	import SystemBubble from '@/components/chat/system-bubble.vue'
	export default {
		components: {
			emotion,
			redenvelope,
			ImgCache,
			SelfBubble,
			OtherBubble,
			SystemBubble
		},
		data() {
			return {
                isHistoryLoading:false,
				textMsg: '',
				redenvelopeFlag: false,
				//@功能数据集
				calls:[],
				myGroupInfo:{},
				memberFlag: false,
				memberData:{},
				forwardData:{},
				forwardFlag: false,
				rClickId:'',
				lClickId:'',
				pageNum:1,
				disabledSay:0,//禁止聊天 1
				rightClickFlag: false,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],//信息列表
				msgImgList:[],
				//录音相关参数
				// #ifndef H5
				//H5不能录音
				RECORDER:uni.getRecorderManager(),
				// #endif
				isVoice:false,
				voiceTis:'按住 说话',
				recordTis:"手指上滑 取消发送",
				recording:false,
				willStop:false,
				initPoint:{identifier:0,Y:0},
				recordTimer:null,
				recordLength:0,
                groupInfo:{},
				//播放语音相关参数
				AUDIO:uni.createInnerAudioContext(),
				playMsgid:null,
				VoiceTimer:null,
				// 抽屉参数
				popupLayerClass:'',
				// more参数
				hideMore:true,
				//表情定义
				hideEmoji:true,
				emojiList:[{}],
				emojiPath:'',
				//红包相关参数
				windowsState:'',
				packet: {
					description:'红包异常',
					money:0,
					number:0,
					userAvatar:'defalut.jpg'
				},
				message:{},
				sel: '' ,
				inputOffsetBottom: 0, //键盘的高度
				viewOffsetBottom: 0, //视窗距离页面的距离
			};
		},
		filters: {
			formatDate: function (e) {
				// 获取js 时间戳
				let time = new Date().getTime();
				// 去掉 js 时间戳后三位
				time = parseInt((time - e) / 1000);
				// 存储转换值
				let s;
				if (time < 60 * 10) {
				  // 十分钟内
				  return '刚刚';
				} else if (time < 60 * 60 && time >= 60 * 10) {
				  // 超过十分钟少于1小时
				  s = Math.floor(time / 60);
				  return s + '分钟前';
				} else if (time < 60 * 60 * 24 && time >= 60 * 60) {
				  // 超过1小时少于24小时
				  s = Math.floor(time / 60 / 60);
				  return s + '小时前';
				} else if (time < 60 * 60 * 24 * 3 && time >= 60 * 60 * 24) {
				  // 超过1天少于3天内
				  s = Math.floor(time / 60 / 60 / 24);
				  return s + '天前';
				} else {
				  // 超过3天
				 var date = new Date(e);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				 var Y = date.getFullYear() + '-';
				 var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				 var D = date.getDate() + ' ';
				 var h = date.getHours() + ':';
				 var m = date.getMinutes() + ':';
				 var ss = date.getSeconds();
				 return Y+M+D+h+m+ss;
				}   
			}
		},
		//头部按钮监听
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				let url = this.chatObj.chatType==1?'groupDetail':'userDetail'
				//console.log(index,url)
				this.$u.route({
					url: 'pages/chat/' + url
				});
				//用户详情 设置
			} else if (index == 1) {
				//返回按钮
				this.$u.route({
					type: 'switchTab',
					url: 'pages/home/home'
				});
			}
		},
		onUnload(){
		},
		onHide(){
		},
		onLoad(option) {
			//语音自然播放结束
			this.AUDIO.onEnded((res)=>{
				this.playMsgid=null;
			});
			// #ifndef H5
			this.RECORDER.onStart((e)=>{
				this.recordBegin(e);
			})
			//录音结束事件
			this.RECORDER.onStop((e)=>{
				this.recordEnd(e);
			})
			// #endif
			this.emojiList =emojiData.imgArr[1].emojiList;
		},
		onShow(){
			this.disabledSay = 0
			this.scrollTop = 9999999;
			// #ifndef APP-PLUS
			this.getMsgList();
			//#endif
			this.sendMsg(0,'');
			//this.openConver();
			//this.queryMembers();
			this.hideDrawer();
			// 每次加入房间通道 群聊有效
			if(this.chatObj.chatType===1){
				var groupIds = [];
				groupIds.push(this.chatObj.chatId);
				this.$socket.joinRoom(groupIds,res=>{});
			}
			// #ifndef H5
			openMsgSqlite().then(res=>{
			});
			createMsgSQL(this.chatObj.chatId).then(res=>{}).catch(res=>{});
			this.getMsgList2()
			// #endif
		},
		onReady() {
            // #ifdef H5
            const icon = document.getElementsByClassName('uni-page-head-btn')[0];
            icon.style.display = 'none';
            // #endif
			uni.setNavigationBarTitle({
				title: this.chatObj.chatName
			});
			//h5暂不支持键盘的高度监听
			uni.onKeyboardHeightChange(res => {
				this.inputOffsetBottom = res.height;
				this.viewOffsetBottom = res.height + uni.upx2px(100);
				if (res.height == 0) {
					// #ifndef MP-WEIXIN
					//this.showInput = false;
					// #endif
				}
			});
		},
		watch: {
			inputOffsetBottom: {
				handler(val) {
					if (val != 0) {
						this.$nextTick(() => {
							//暂时不支持h5的滚动方式 因为h5不支持键盘的高度监听
							//微信小程序会把input的焦点和placeholder顶起，正在寻找解决方案
							// #ifndef MP-WEIXIN || H5
							//this.bindScroll(this.sel, 100);
							// #endif
						});
					}
				}
			}
		},
		methods:{
			scrollToBottom(t) {
					let that = this
					let query = uni.createSelectorQuery()
					query.select('#scrollview').boundingClientRect()
					query.select('#msglistview').boundingClientRect()
					query.exec((res) => {
						if(res[1].height > res[0].height){
							that.scrollTop = res[1].height - res[0].height
						}
					})
			},
			weizhi(){
				uni.getLocation({
					type: 'wgs84 ',
					success: function (res) {
						Map.openMap(res.latitude, res.longitude, '易群', 'wgs84')
					}
				});
			},
			//收藏表情
			collectFunc({msgContext}){
				this.$socket.addEmoticon(this._user_info.id, msgContext, res => {
					if(res.success){
						uni.showToast({
							icon:'none',
							title:'添加成功'
						})
					}
				  });
			},
			//删除
			deleteFunc(id,index){
				this.msgList.splice(index,1);
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
			//发送红包
			redenvelopeFunc(packet){
				this.sendMsg(7, packet)
				this.redenvelopeFlag = false;
			},
			//暂时不适配微信小程序，正在解决此bug
			bindScroll(sel, duration = 0) {
				uni.createSelectorQuery()
					.select('#content')
					.boundingClientRect(data => {
						console.log(data)
						//最外层盒子节点
						uni.createSelectorQuery()
							.select(sel)
							.boundingClientRect(res => {
								console.log(res)
								if (!res) return;
								//选中的节点
								let windowHeight = 0;
								uni.getSystemInfo({
									success: system => {
										windowHeight = system.windowHeight;
									}
								});
								const inputKeyBoardHeight = uni.upx2px(100) + this.inputOffsetBottom; //input输入框和键盘的高度
								const contentHeight = windowHeight - inputKeyBoardHeight; //可视内容的高度（除去input输入框和键盘）
								let scrollTop = 0;
								scrollTop = res.top - data.top - contentHeight + res.height; //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离再减去可视内容的高度然后再加上此元素的高度
								console.log(scrollTop)
								uni.pageScrollTo({ duration, scrollTop });
							})
							.exec();
					})
					.exec();
			},
			//@共功能
			processFunc(){
				this.scrollAnimation = false;
				if(this.calls.length>0){
					this.scrollToView = 'msg'+this.calls[0];
					this.$nextTick(function() {
						this.bindScroll(this.scrollToView)
						this.scrollAnimation = true;
					});
					this.calls.splice(0, 1)
					this.$u.vuex('_call_s',this.calls)
				}
			},
			//监听输入框
			Input(e){
				if(this.textMsg.indexOf('@')!=-1){
				  if (this.chatObj.chatType==1){
					  this.$u.route({
					  	url:'pages/chat/call',
					  	params:{ msg :this.textMsg }
					  });	
				  }
				}
			},
			//获取群成员
            queryMembers () {
                if (this.chatObj.chatType == 1) {
                 this.$socket.queryMembers(this.chatObj.chatId, this._user_info.id, (res) => {
					 this.$u.vuex('_members', res.memberResponse);
					 this.myGroupInfo = {
					 	groupUser: res.groupUser,
					 	group: res.group
					 }
				 })
                }
            },
			//消费消息
			openConver () {
			  let _this = this
			  this.$socket.openChat(this.chatObj.chatId, this._user_info.id, this.chatObj.chatType, res => {
				if (res.success) {
				  if (_this.chatObj.chatType == 1) {
					if (res.groupUser === undefined) {
					  _this.disabledSay = 1
					} else {
					  _this.disabledSay = res.groupUser.status
					}
				  }
				}
			  })
			},
			//获取消息记录
			getMsgList () {
			      this.pageNum = 1
				  //关闭滑动动画
				  this.scrollAnimation = false;
				  let arr = ['queryFriendMessages','queryGroupMessages'];
				  let type = this.chatObj.chatType
			      this.$socket[arr[type]](this.chatObj.chatId, this._user_info.id, this.pageNum, (res) => {
			        if (res.success) {
			          let data = res.response.data
					  if(data.length>0){
						  data.forEach(msg=>{
							  if(msg.msgType==1){
								  let url = this.$url+msg.msgContext
								  this.msgImgList.push(url)
							  }
						  })
					  }
					  this.msgList = data
			          this.msgList.sort((a, b) => { return a.id - b.id })
					  this.$nextTick(function() {
					  	this.scrollTop = 9999;
					  	this.$nextTick(function() {
					  		this.scrollAnimation = true;
					  	});
					  });
			        }
			      });
			},
			// 本地化获取消息记录
			getMsgList2(){
				this.scrollAnimation = false;
				selectMsgSQL(this.chatObj.chatId).then(res=>{
					this.msgList = res
					this.$nextTick(function() {
						this.scrollTop = 9999;
						this.$nextTick(function() {
							this.scrollAnimation = true;
						});
					});
				});
			},
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e){
			uni.showLoading({
				title:"加载中..."
			})

			//参数作为进入请求标识，防止重复请求
			this.scrollAnimation = false;
			//关闭滑动动画
			let arr = ['queryFriendMessages','queryGroupMessages'];
			let i = this.chatObj.chatType
			  this.$socket[arr[i]](this.chatObj.chatId, this._user_info.id, this.pageNum, res => { 
				  let message = res.response.data;
				  if(message.length>0){
					  message.forEach(m=>{
						  if (!this.msgList.map(v => v.id).includes(m.id)) {
							this.msgList.push(m)
						  }  
					  })
					this.msgList.sort((a, b) => { return a.id - b.id })
					this.$nextTick(() => {
						this.scrollToView = 'msg' + this.msgList[0].id
						this.scrollAnimation = true;
						this.pageNum++
					});
				  }
				  uni.hideLoading();
				  this.scrollAnimation = true;
				});
			},
			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content){
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
				let maxH = uni.upx2px(350);//350是定义消息图片最大高度
				if(content.w>maxW||content.h>maxH){
					let scale = content.w/content.h;
					content.w = scale>1?maxW:maxH*scale;
					content.h = scale>1?maxW/scale:maxH;
				}
				return content;
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
				this.popupLayerClass = 'showLayer';
				this.scrollAnimation = false
				this.$nextTick(() => {
					this.scrollToView = 'msg' + this.msgList[this.msgList.length-1].id
					this.scrollAnimation = true;
				});
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
					this.rClickId = '';
					this.lClickId = '';
				},150);
			},
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
				this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){this.hideDrawer();
				
			},
			//选照片 or 拍照
			getImage(type){
				let that=this;
				this.hideDrawer();
				uni.chooseImage({
					sourceType:[type],
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: (res)=>{
						for(let i=0;i<res.tempFilePaths.length;i++){
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: (image)=>{
									  uni.uploadFile({
									            url: this.$uploadUrl, //仅为示例，非真实的接口地址
									            filePath: res.tempFilePaths[i],
									          header: {
											   'merchcode':'md5'
											   },
											   name: 'file',
											   formData: {
											       'user': 'test'
											   },
											     success: (res) => {
													 let data = JSON.parse(res.data)
												     this.sendMsg(1, data.data)
									            }
									   });
								}
							});
						}
					}
				});
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
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus(){
				if(this.popupLayerClass=='showLayer' && this.hideMore == false){
					this.hideDrawer();
				}
			},
			//发送消息
			sendMsg (msgType, text) {
				
			 if (this.disabledSay == 1) {
				 uni.showToast({
				 	title:'你已经被管理员禁言'
				 })
				 return;
			 }
			 
			  let arr = ['send2Friend','send2Group']
			  let _this = this
			  this.$socket[arr[this.chatObj.chatType]](this.chatObj.chatId, this._user_info.id, text, msgType, res => {
				if (res.success) {
					if (res.response!==undefined) {
						const data = res.response.data
						if(res.msgType===8){
							_this.addRobEnvelope(res);
						}else if(res.msgType===6){
							_this.addRevoke(res);
						}else {
							if(_this.chatObj.chatType===1){
								if(data!==undefined){
									if (data.groupId === this.chatObj.chatId) {
										_this.addMsg(data);
									}
								}
							}else {
								_this.addMsg(data);
							}
						}
					}
				}
			  });
			  if (text !== '') {
			  	this.$socket.createChatList(this._user_info.id, this.chatObj.chatId, text, msgType, res => {})
			  }
			  this.textMsg = ''
			},
			// 接受消息(筛选处理)
			addMsg(msg){
				// 用户消息
				switch (msg.msgType){
					case 0:
						this.addTextMsg(msg);
						break;
					case 1:
						this.addImgMsg(msg);
						break;
					case 3:
						this.addVoiceMsg(msg);
						break;
					case 7:
						this.addRedEnvelopeMsg(msg);
						break;
					default:
				}
				// #ifndef H5
				addMsgSQL(msg).then(res=>{}).catch(res=>{})
				// #endif
				this.scrollAnimation = false
				this.$nextTick(() => {
					this.scrollToView = 'msg' + this.msgList[this.msgList.length-1].id
					this.scrollAnimation = true;
				});
				//非自己的消息震动
				// if(msg.sendUid!=this._user_info.id){
				// 	uni.vibrateLong();
				// } else {
				// 	this.openConver();
				// }
			},
			addRevoke(res){
				if (res.msgId != undefined && res.message == undefined) {
				  for(var index in this.msgList){
					if(this.msgList[index].id==res.msgId){
						this.msgList.splice(index,1)
					}
				  }
				}
			},
			addRobEnvelope(res){
				if (res.msgId != undefined && res.message != undefined) {
				 this.packet = this.redenvelopeProcess(res.message)
				}
			},
			//@功能处理
			process(msg) {
				// let groupNickName = this.myGroupInfo.groupUser.groupNickName || ''
				// let msgContext = msg.msgContext || ''
				// //包含自己
				// if(msgContext.indexOf('@')!=-1){
				// 	if(msgContext.includes('@'+groupNickName)||
				// 		msgContext.includes('@all')||
				// 		msgContext.includes('@All')){
				// 		this.calls.push(msg.id);
				// 	} else if (msgContext.includes('@'+this._user_info.nickName)){
				// 		this.calls.push(msg.id);
				// 	}
				// 	this.$u.vuex('_call_s',this.calls)
				// }
			},
			//替换表情符号为图片
			replaceEmoji(str){
				// 正则表达式匹配内容
				let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g,(item, index)=>{
					// console.log("item: " + item);
					for(let i=0;i<this.emojiList.length;i++){
						let row = this.emojiList[i];
						for(let j=0;j<row.length;j++){
							let EM = row[j];
							if(EM.alt==item){
								let onlinePath=this.emojiPath
								let imgstr = '<img style="width:24px;height:24px;" src="'+onlinePath+EM.url+'">';
								return imgstr;
							}
						}
					}
				});
				return '<div style="align-items: center;word-wrap:break-word;">'+replacedStr+'</div>';
			},
			// 添加文字消息到列表
            addTextMsg(msg){
                this.msgList.push(msg);
            },
            // 添加语音消息到列表
            addVoiceMsg(msg){
                this.msgList.push(msg);
            },
            // 添加图片消息到列表
            addImgMsg(msg){
                let url = this.$url+ msg.msgContext
                this.msgImgList.push(url);
                this.msgList.push(msg);
            },
            addRedEnvelopeMsg(msg){
                this.msgList.push(msg);
            },
            // 添加系统文字消息到列表
            addSystemTextMsg(msg){
                this.msgList.push(msg);
            },
            // 添加系统红包消息到列表
            addSystemRedEnvelopeMsg(msg){
                this.msgList.push(msg);
            },
			// 关闭红包弹窗
			closeRedEnvelope(){
				this.windowsState = 'hide';
				setTimeout(()=>{
					this.windowsState = '';
				},200)
			},
			//领取详情
			toDetails(){
				// 获取最新红包情况
				//TODO 从服务器上获取红包列表
				//let packet = this.redenvelopeProcess(this.message.msgContext)
				this.$u.vuex('_redenvelope',this.packet)
				uni.navigateTo({
					url:'./detail'
				})
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
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
			},
			discard(){
				return;
			}
		}
	}
</script>
<style lang="scss">
	@import "./style.scss";
</style>
