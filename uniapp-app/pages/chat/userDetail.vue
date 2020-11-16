<template>
	<view class="content">
		<u-navbar :is-back="true" title="聊天详情" :background="{ background: '#F6F7F8'  }" title-color="#404133" :border-bottom="false" z-index="1001">
		</u-navbar>
		<view style="background-color: #FFFFFF;padding-left: 30rpx;">
			<u-grid :col="6" :border="false">
				<u-grid-item>
					<u-avatar :src="url" mode="square"></u-avatar>
					<view class="grid-text">{{userInfo.nickName}}</view>
				</u-grid-item>
				<u-grid-item @click="showAddGroupUser">
					<u-image width="92rpx" height="90rpx" src="/static/add-bd.png"></u-image>
				</u-grid-item>
			</u-grid>
		</view>
		<view style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item title="查看聊天内容" @click="showSearch" :title-style="{ marginLeft: '10rpx' }">
			</u-cell-item>
		</u-cell-group>
		<view style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item title="设置当前聊天背景" :title-style="{ marginLeft: '10rpx' }" @click="chooseImg">
			</u-cell-item>
		</u-cell-group>
		<view style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item :title-style="{ marginLeft: '10rpx' }" @click="deleteFriendMsg" :arrow="false">
				<view style="text-align: center; color: red;">清空聊天记录</view>
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatId:'',
				chatName:'',
				userInfo:{},
				url: require('@/static/image/huge.jpg')
			}
		},
		methods: {
			showSearch() {
				this.$u.route({
					url:"pages/search/search",
					params: {searchType: 3, chatId:this.chatId}
				})
			},
			getUserInfo(){
				this.$socket.getUserById(this.chatObj.chatId, res=> {
					this.userInfo = res.user
					this.url = this.$url + res.user.avatar
				})
			},
			showAddGroupUser(){
				this.$u.route({
					url: 'pages/chat/addGroupUser',
					params: { chatId: this.chatId, chatName: this.chatName, type: 1 }
				});
			},
			chooseImg() {
				this.$u.route({
					url: 'components/u-avatar-cropper/u-avatar-cropper',
					params: {
						destWidth: uni.upx2px(750),
						rectWidth: uni.upx2px(500),
						fileType: 'jpg'
					}
				});
			},
			deleteFriendMsg(){
				this.$socket.deleteFriendMsg(this._user_info.id, this.chatId, res=> {
					if (res.success) {
						uni.showModal({
							title: '成功',
							showCancel: false
						});
					} else {
						uni.showModal({
							title: '失败',
							showCancel: false
						});
					}
				})
			},
		},
		onLoad(option) {
		},
		onShow() {
		},
		onReady() {
			this.getUserInfo()
		}
	}
</script>

<style lang="scss" scoped>
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 60rpx 38rpx;
		background-color: #ffffff;
		&_left{
			display: flex;
			align-items: center;
			&_content{
				padding-left: 20rpx;
				&_name{
					font-weight: bold;
				}
				&_number{
					color:#969799 ;
					font-size: 26rpx;
				}
			}
		}
		&_right{
			font-size: 28rpx;
			color: #969799;
		}
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 6rpx;
		}
	}
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
</style>
