<template>
	<view>
		<view class="content" id="content" @touchstart="hideDrawer">
			<scroll-view id="scrollview" class="msg-list" :class="{'chat-h':popupLayerClass === 'showLayer'}" scroll-y="true"
			 :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory"
			 upper-threshold="50">
				<view id="msglistview" class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.id">
					<!-- 系统通知的消息 -->
					<system-bubble :row="row"></system-bubble>
					
					<!-- 别人发出的消息 -->
					<left-bubble @openLeft="openLeft" :lClickId="lClickId" :row="row" :playMsgId="playMsgid" :index="index"
					 @openRedPacket="openRedPacket"></left-bubble>
					
					<!-- 自己发出的消息 -->
					<right-bubble @sendMsg="sendMsg" @openRight="openRight" :rClickId="rClickId"
					  :index="index" @openRedPacket="openRedPacket" :row="row" :playMsgid="playMsgid"></right-bubble>
				</view>
			</scroll-view>
		</view>
		
		<!-- 抽屉栏 -->
		<im-drawer @addEmoji="addEmoji" @sendMsg="sendMsg" @getImage="getImage"
				   @redShow="redFlag = true" :hideMore="hideMore" :hideEmoji="hideEmoji" :popupLayerClass="popupLayerClass"></im-drawer>
		
		<!-- 底部输入框 -->
		<footer-input @textMsgFunc="textMsgFunc" @switchVoice="switchVoice" @chooseEmoji="chooseEmoji" @sendMsg="sendMsg"
					  @showMore="showMore" @textareaFocus="textareaFocus" @hideDrawer="hideDrawer" @openDrawer="openDrawer"
		 :disabledSay="disabledSay" :textMsg2="textMsg" :popupLayerClass="popupLayerClass"
					  :inputOffsetBottom="inputOffsetBottom" :isVoice="isVoice"></footer-input>
		
		<!-- 红包卡片弹窗 -->
		<red-card @robRed="robRed" @closeRedEnvelope="closeRed" :windowsState="windowsState" :packet="packet"></red-card>
		
		<!-- 发红包弹窗 -->
		<u-popup v-model="redFlag" mode="bottom" length="50%">
			<red-envelope @sendRedPacket="sendRedPacket">
			</red-envelope>
		</u-popup>
	</view>
</template>
<script>
	import ImDrawer from '@/components/chat/im-drawer.vue'
	import RedCard from '@/components/chat/red-card.vue'
	import RedEnvelope from "@/components/redenvelope"
	import emojiData from "../../static/emoji/emojiData.js"
	import ImgCache from '@/components/img-cache/img-cache.vue'
	import RightBubble from '@/components/chat/right-bubble.vue'
	import LeftBubble from '@/components/chat/left-bubble.vue'
	import FooterInput from '@/components/chat/footer-input.vue'
	import SystemBubble from '@/components/chat/system-bubble.vue'
	import { openMsgSqlite, createMsgSQL, selectMsgSQL, addMsgSQL } from '../../util/msg.js'
	import { queryData, upData, initData } from '../../util/dbUtil.js'
	export default {
		components: {
			ImDrawer,
			RedCard,
			ImgCache,
			RightBubble,
			LeftBubble,
			SystemBubble,
			RedEnvelope,
			FooterInput
		},
		data() {
			return {
                isHistoryLoading:false,
				textMsg: '',
				redFlag: false,
				calls:[],
				myGroupInfo:{},
				memberFlag: false,
				memberData:{},
				forwardData:{},
				forwardFlag: false,
				rClickId:0,
				lClickId:0,
				pageNum:1,
				disabledSay:0,
				rightClickFlag: false,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],
				isVoice:false,
                groupInfo:{},
				playMsgid:null,
				popupLayerClass:'',
				hideMore:true,
				hideEmoji:true,
				emojiList:[{}],
				emojiPath:'',
				windowsState:'',
				packet: {
					description:'红包异常',
					money:0,
					number:0,
					userAvatar:'defalut.jpg',
					Records:[]
				},
				message:{},
				sel: '' ,
				inputOffsetBottom: 0, 
				viewOffsetBottom: 0, 
			};
		},
		//头部按钮监听
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				let url = this.chatObj.chatType==1?'groupDetail':'userDetail'
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
			this.emojiList =emojiData.imgArr[1].emojiList;
		},
		onShow(){
			this.disabledSay = 0
			this.scrollTop = 9999999;
			this.sendMsg(0,'');
			this.getMsgItem();
			this.openConver();
			this.hideDrawer();
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
			textMsgFunc(t){
				this.textMsg = t;
			},
			// 切换语音/文字输入
			switchVoice(){
				this.hideDrawer();
				this.isVoice = this.isVoice?false:true;
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
						console.log(em.emojiItem.alt)
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
			openLeft(row){
				this.lClickId = row.id;
			},
			openRight(row){
				this.rClickId = row.id;
			},
			// 关闭红包弹窗
			closeRed(){
				this.windowsState = 'hide';
				setTimeout(()=>{
					this.windowsState = '';
				},200)
			},
			// 打开红包
			openRedPacket(msg){
				this.windowsState = 'show'
				//获取最新的message
				this.message = msg
				// 解析红包数据
				this.packet = this.redenvelopeProcess(msg.msgContext)
			},
			robRed(){
				// 开始抢红包
				this.sendMsg(8, this.message.id);
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
			hideRed(){
				this.redFlag = false;
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
					if(this.msgList.length>0){
						this.scrollToView = 'msg' + this.msgList[this.msgList.length-1].id
						this.scrollAnimation = true;
					}
				});
			},
			// 隐藏抽屉
			hideDrawer(){
				this.popupLayerClass = '';
				setTimeout(()=>{
					this.hideMore = true;
					this.hideEmoji = true;
					this.rClickId = 0;
					this.lClickId = 0;
				},150);
			},
			// 置底
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
					userAvatar:'defalut.jpg',
					surplusMoney:0,
					records:[]
				}
				if(packets==undefined){
					return msg;
				}
				if(packets.length==0){
					return msg;
				}
				return packets[0];
			},
			//发送红包
			sendRedPacket(packet){
				if(this.chatObj.chatType==0){
					uni.showToast({
						title:'暂不支持私发红包'
					})
					return;
				}
				this.sendMsg(7, packet)
				this.redFlag = false;
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
					  	url:'pages/chat/remind',
					  	params:{ msg :this.textMsg }
					  });	
				  }
				}
			},
			//获取群成员
            queryMembers () {
                if (this.chatObj.chatType == 1) {
                 this.$socket.queryMembers(this.chatObj.chatId, this.userData.user.operId, (res) => {
					 this.$u.vuex('memberItem', res.memberResponse);
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
			  this.$socket.openChat(this.chatObj.chatId, this.userData.user.operId, this.chatObj.chatType, res => {
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
			// localStorage版本获取消息列表
			getMsgItem(){
				if(this.chatObj.chatType==0){
					this.scrollAnimation = false;
					 this.$socket.queryFriendMessages(this.chatObj.chatId, this.userData.user.operId,1, (res) => {
						 this.msgList = res.response.data;
						 this.scrollTop = 9999;
						 this.scrollAnimation = true;
					 });
				}else {
                    this.scrollAnimation = false;
                    queryData(this.chatObj.chatId).then(res=>{
                        this.msgList = res;
                        this.$nextTick(function() {
                            this.scrollTop = 9999;
                            this.scrollAnimation = true;
                        });
                    });
				}
			},
			// sqlite版本获取消息列表
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
			  this.$socket[arr[i]](this.chatObj.chatId, this.userData.user.operId, this.pageNum, res => { 
				  let message = res.response.data;
				  if(message.length>0){
					  message.forEach(m=>{
						  if (!this.msgList.map(v => v.id).includes(m.id)) {
							this.msgList.push(m)
						  }  
					  })
					this.msgList.sort((a, b) => { return a.id - b.id })
					this.$nextTick(() => {
						//this.scrollToView = 'msg' + this.msgList[0].id
						this.scrollAnimation = true;
						this.pageNum++
					});
				  }
				  uni.hideLoading();
				  //this.scrollAnimation = true;
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
			
			// 选择图片发送
			chooseImage(){
				this.getImage('album');
			},
			//拍照发送
			camera(){
			  this.getImage('camera');
			},
			//发红包
			handRedEnvelopes(){
			  this.hideDrawer();
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
				 });
				 return;
			 }
			 
			 if(text!=''){
				 this.$socket.createChatList(this.userData.user.operId, this.chatObj.chatId, text, msgType, res => {});
			 }
			 
			  let arr = ['send2Friend','send2Group'];
			  let _this = this;
			  this.scrollAnimation = false;
			  
			  this.$socket[arr[this.chatObj.chatType]](this.chatObj.chatId, this.userData.user.operId, text, msgType, res => {
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
									upData(data, _this.chatObj.chatId);
								}
							}else {
								_this.addMsg(data);
							}
						}
					}
				}
			  });
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
				
				this.$nextTick(() => {
					this.scrollTop = 9999;
					this.scrollToView = 'msg' + this.msgList[this.msgList.length-1].id
					this.scrollAnimation = true;
				});
				//非自己的消息震动
				if(msg.sendUid!==this.userData.user.operId){
					uni.vibrateLong();
				}
			},
			//增加撤销
			addRevoke(res){
				if (res.msgId != undefined && res.message == undefined) {
				  for(var index in this.msgList){
					if(this.msgList[index].id==res.msgId){
						this.msgList.splice(index,1)
					}
				  }
				}
			},
			// 增加红包
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
			discard(){
				return;
			},
		}
	}
</script>
<style lang="scss">
	@import "./style.scss";
</style>
