<template>
	<view>
		<u-grid :col="6" :border="false">
			<u-grid-item v-for="(item, index) in memberItemIndex" :index="index" :key="item.id" @tap="linkTo(item.id)">
				<img-cache :src="$url + item.avatar"></img-cache>
				<view class="grid-text">{{ item.groupNickName||item.nickName }}</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
	import ImgCache from '@/components/img-cache/img-cache.vue';
	export default {
		name:'moreMembers',
		components:{
			ImgCache
		},
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
				this.$socket.queryMembers(this.chatObj.chatId, this.userData.user.operId, res => {
					if (res.success) {
						this.$u.vuex('memberItemIndex',res.members)
						uni.setNavigationBarTitle({
							title: '群成员(' + this.memberItemIndex.length +')'
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
	.img-cache{
		width: 80rpx;
		height: 80rpx;
	}
</style>
