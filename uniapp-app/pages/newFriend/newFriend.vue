<template>
	<view class="content">
		<u-navbar
			:is-back="true"
			title="新的朋友"
			:background="{ background: '#F6F7F8' }"
			title-color="#404133"
			:border-bottom="false"
			z-index="1001"
		></u-navbar>
		<view v-for="(value, index) in list">
			<view class="item u-border-bottom" :class="value.isTop ? 'bg_view' : ''" hover-class="message-hover-class" @tap="linkTo(value)">
				<img-cache :src="`${$url}/${value.avatar || value.imgUrl}`"></img-cache>
				<u-badge :count="value.unreadNumber"  type="error" class="badge" :offset="offset"></u-badge>
				<view class="right title-wrap">
					<view class="right_top">
						<view class="right_top_name u-line-1">{{ value.chatName }}</view>
						<view class="right_top_time ">{{value.lastOperTime || value.lastOpenTime | format}}</view>
					</view>
					<view class="right_btm ">
						<view class="u-line-1">{{value.msgType==0?value.content:message[value.msgType]}}</view>
						<view class="" v-show="voiceIcon">
							<u-icon color="#c4c7cf" v-if="index%2==0" name="bell" size="22"></u-icon>
						</view>
					</view>
				</view>
			</view>
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
			type: 0
		};
	},
	onLoad({ type }) {
		this.type = type;
	},
	onShow() {
		this.type==1?this.getNewFriend(false):this.getGroups(false);
	},
	onPullDownRefresh() {
		this.type==1?this.getNewFriend(true):this.getGroups(true);
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
		getNewFriend(freshFlag) {
			this.$socket.queryFriendRequestList(this._user_info.id, res => {
				this.list = res.userList;
				if(freshFlag){
					uni.stopPullDownRefresh();
				}
			});
		},
		getGroups(freshFlag) {
			this.$socket.getGroups('', this._user_info.id, res => {
				this.list = res.response.data;
				if(freshFlag){
					uni.stopPullDownRefresh();
				}
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
