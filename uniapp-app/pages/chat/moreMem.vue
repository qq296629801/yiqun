<template>
	<view>
		<u-grid :col="6" :border="false">
			<u-grid-item v-for="(item, index) in _membersNoneIndex" :index="index" :key="item.id" @tap="linkTo(item.id)">
				<u-avatar :src="$url + item.avatar" mode="square"></u-avatar>
				<view class="grid-text">{{ item.groupNickName||item.nickName }}</view>
			</u-grid-item>
			<u-grid-item @tap="showAddGroupUser">
				<view style="padding-bottom: 40rpx;">
					<u-icon name="plus" size="40"></u-icon>
				</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
	export default {
		name:'moreMembers',
		components:{},
		data() {
			return {
			};
		},
		onShow() {
			this.queryMems();
		},
		methods:{
			showAddGroupUser(){
				this.$u.route({
					url: 'pages/chat/addGroupUser'
				});
			},
			linkTo(id){
				this.$u.route({
					url: 'pages/businessCard/businessCard',
					params:{ id: id, source: 1}
				})
			},
			queryMems(){
				this.$socket.queryMembers(this.chatObj.chatId, this._user_info.id, res => {
					if (res.success) {
						this.$u.vuex('_membersNoneIndex',res.members)
						uni.setNavigationBarTitle({
							title: '群成员(' + this._membersNoneIndex.length +')'
						});
					} else {
						uni.showModal({
							title: '获取数据失败',
							showCancel: false
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.grid-text{
		width: 80rpx;
		overflow: hidden;
		height: 44rpx;
	}
</style>
