<template>
	<view>
		<view class="userinfo">
			<u-avatar :src="$url + userInfo.avatar" mode="square" size="110" @tap="previewImg(url)"></u-avatar>
			<view class="userinfo-desc">
				<view class="userinfo-desc-name">{{userInfo.nickName||userInfo.realname }}</view>
				<view class="userinfo-desc-gray">积分：{{userInfo.money}}</view>
			</view>
		</view>
		<view  class="perch"></view>
		<u-cell-group v-if="1 == source">
			<u-cell-item title="朋友圈" label="模拟数据暂不支持查看好友朋友圈" hover-class="none" :title-style="{ marginLeft: '10rpx' }"></u-cell-item>
			<u-cell-item title="更多信息" :title-style="{ marginLeft: '10rpx' }" @click="linkToMoreInfoMation"></u-cell-item>
		</u-cell-group>
		<view class="" v-if="!isItMe">
			<view  class="perch"></view>
			<u-cell-group v-if="0 == source || 2 == source">
				<u-cell-item title="" @click="toAddUser" :arrow="false" :center="true" :title-style="{ marginLeft: '10rpx' }">
					<view style="text-align: center;">添加到通讯录</view>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group v-else-if="1 == source">
				<u-cell-item title="发消息" :arrow="false" :center="true" :title-style="{ marginLeft: '10rpx' }" @click="linkToChat">
					<u-icon slot="icon" name="chat" color="#36648B" size="34"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{
				},
				isItMe:false,
				source:''
			}
		},
		methods: {
			linkToChat(){
				console.log(this.userInfo);
				let chat = {
					chatId: this.userInfo.id,
					chatType:0,
					chatName:this.userInfo.nickName
				}
				this.$u.vuex('chatObj',chat);
				this.$u.route({
					url:"pages/chat/chat"
				});
			},
			previewImg(urls){
				uni.previewImage({urls:[urls]})
			},
			linkToMoreInfoMation(){
				this.$u.route({
					url:"pages/moreInforMation/moreInforMation",
					params:{ signature:this.userInfo.signature }
				})
			},
			toAddUser(){
				this.$socket.insertFriend(this.userData.user.operId, this.userInfo.id, res => {
					if (res.success) {
						uni.showModal({
							title: '请求已发送',
							showCancel: false
						});
					}
				});
			},
		},
		onLoad({ id, nickName, source }) {
			this.source = source
			if(0 == source){
				let _this = this
				this.$socket.findFriendRequestList(nickName, res => {
					if (res.success) {
						res.userList.forEach(function(element) {
							if(element.id == id){
								_this.userInfo = element
							}
						});
					}
				});
			}else if(2 == source){
				this.$socket.getUserById(id, res=>{
					this.userInfo = res.user
				})
			} else {
				if(id == this.userData.user.operId){
					this.userInfo = this.userData.user;
					this.isItMe = true;
					return;
				}
				for(let i in this.firendItem){
					let members = this.firendItem[i].members
					for(let j in members){
						if (members[j].id==id){
							this.userInfo = members[j]
						}
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.perch{
		height: 10rpx;
	}
.userinfo{
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	padding: 20rpx 30rpx 40rpx 40rpx;
	background-color: #FFFFFF;
	.img{
		display: block;
		width: 110rpx;
		height: 110rpx;
		border-radius: 10rpx;
	}
	&-desc{
		padding-left: 30rpx;
		&-name{
			font-weight: bold;
			font-size: 36rpx;
			transform: translateY(-10rpx);
		}
		&-gray{
			color: $u-tips-color;
			font-size: 29rpx;
		}
	}
}
</style>
