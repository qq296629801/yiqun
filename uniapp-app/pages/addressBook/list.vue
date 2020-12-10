<template>
	<view class="content">
		<u-navbar
			:is-back="true"
			:title="1 == this.type ? '新的朋友' : '群组'"
			:background="{ background: '#F6F7F8' }"
			title-color="#404133"
			:border-bottom="false"
			z-index="1001"
		></u-navbar>
		<view v-for="(item, index) in list">
			<chatItem @linkTo="linkTo(item)" :value="item" :index="index"></chatItem>
		</view>
	</view>
</template>

<script>
import chatItem from '@/components/chatItem.vue';
export default {
	components: {
		chatItem
	},
	data() {
		return {
			list: [],
			// 0 群组 1 新的朋友
			type: 0
		};
	},
	onLoad({ type }) {
		this.type = type;
	},
	onShow() {
		this.type==1?this.getNewFriend():this.getGroups();
	},
	methods: {
		linkTo(item) {
			if (1 == this.type) {
				console.log('新的朋友')
			} else {
				this.$u.vuex('chatObj', item);
				this.$u.route({url: 'pages/chat/chat'});
			}
		},
		getNewFriend() {
			this.$socket.queryFriendRequestList(this._user_info.id, res => {
				this.list = res.userList;
			});
		},
		getGroups() {
			this.$socket.getGroups('', this._user_info.id, res => {
				this.list = res.response.data;
			});
		}
	}
};
</script>

<style lang="scss">
	.content{
		background-color: #fff;
	}
</style>
