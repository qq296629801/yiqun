<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#F6F7F8' }">
			<view class="slot-wrap">
				<u-search
					:focus="true"
					@custom="clickCancel"
					placeholder="搜索..."
					shape="square"
					:action-style="{ color: '#007aff' }"
					action-text="取消"
					:bg-color="'#ffffff'"
					v-model="searchWord"
				></u-search>
			</view>
		</u-navbar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="status_bar"></view>
		<view class="content_search">
			<u-search
				:focus="true"
				@custom="clickCancel"
				@search="toSearch"
				placeholder="h5能否自动获取焦点取决于浏览器的实现"
				shape="square"
				:action-style="{ color: '#007aff' }"
				action-text="取消"
				:bg-color="'#ffffff'"
				v-model="searchWord"
			></u-search>
		</view>
		<!-- #endif -->
		<view class="content1" v-if="'0' == searchType">
			<view v-for="(item, index) in list" :key="index">
				<chatItem @linkTo="toUserInfo" :value="item" :index="index"></chatItem>
			</view>
		</view>
		<view class="content" v-else-if="'1' == searchType">
			<template v-for="(item,index) in list">
				<chatItem @linkTo="linkTo" :value="item" :index="index"></chatItem>
			</template>
		</view>
		<view class="content1" v-else-if="'2' == searchType">
			<addressBook :list="list" :scrollTop="scrollTop" @linkTo="linkToCard"></addressBook>
		</view>
		<view class="content" v-else-if="'3' == searchType || '4' == searchType">
			<template v-for="(item, index) in list">
				<chatItem :value="item" :index="index"></chatItem>
			</template>
		</view>
	</view>
</template>

<script>
import chatItem from '@/components/chatItem.vue';
import addressBook from '@/components/addressBook.vue'
import { pinyin } from '../../public/Pinyin.js';
export default {
	name:'search',
	components:{chatItem,addressBook},
	data() {
		return {
			chatId: '',
			pageNum: -1,
			searchType: '0',
			searchWord: '',
			list: [],
			scrollTop:0
		};
	},
	watch:{
		searchWord:function(v){
			this.toSearch(v)
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		toUserInfo(userInfo){
			this.$u.route({
				url: 'pages/businessCard/businessCard',
				params:{ ...userInfo, source: 2}
			})
		},
		clickCancel() {
			this.$u.route({
				type: 'navigateBack'
			});
		},
		linkToCard({ id }) {
			this.$u.route({
				url: 'pages/businessCard/businessCard',
				params:{ id: id, source: 0}
			});
		},
		toSearch(v) {
			let that = this;
			const keyword = v
			switch(that.searchType){
				case '0':
					that.$socket.findFriendRequestList(keyword, res => {
						if (res.success) {
							that.list = res.userList;
						}
					});
					break;
				case '1':
					that.$socket.queryChats(keyword, that.userData.user.operId, res => {
						if (res.success) {
							that.list = res.chats;
						}
					});
					break;
				case '2':
					that.list = that.firendItem.filter(v => {
						let flag = false
						if(v.members.length>0){
							v.members.forEach(m=>{
								if(m.nickName.includes(keyword)
								||pinyin.getCamelChars(m.nickName).includes(keyword)
								||pinyin.getFullChars(m.nickName).includes(keyword)){
									flag = true
								}
							})
						}
						return flag
					});
					break;
				case '3':
					that.$socket.getFriendMessageByCondition(this.chatId, that.userData.user.operId, this.pageNum, keyword, res => {
						if (res.success) {
							that.list = res.response.data;
						}
					});
				case '4':
					that.$socket.getGroupMessageByCondition(this.chatId, that.userData.user.operId, this.pageNum, keyword, res => {
						if (res.success) {
							that.list = res.response.data;
						}
					});
					break;
				default:
			}
		},
		linkTo(chat) {
			this.$u.vuex('chatObj',chat);
			this.$u.route({
				url: 'pages/chat/chat',
				params: {}
			});
		}
	},
	onShow() {},
	onLoad({ searchType, chatId }) {
		this.searchType = searchType;
		this.chatId = chatId;
	}
};
</script>

<style lang="scss" scoped>
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
.content_search {
	padding: 16rpx;
	background-color: #F6F7F8;
}
.content {
	.item {
		width: 750rpx;
		display: flex;
		align-items: center;
		// padding: 20rpx;
		image {
			width: 76rpx;
			height: 76rpx;
			margin: 20rpx;
			border-radius: 12rpx;
			flex: 0 0 76rpx;
		}
		.right {
			overflow: hidden;
			flex: 1 0;
			padding: 20rpx 20rpx 20rpx 0;
			&_top {
				display: flex;
				justify-content: space-between;
				&_name {
					font-size: 28rpx;
					color: $u-main-color;
					flex: 0 0 450rpx;
					overflow: hidden;
				}
				&_time {
					font-size: 22rpx;
					color: $u-light-color;
				}
			}
			&_btm {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22rpx;
				color: $u-tips-color;
				padding-top: 10rpx;
			}
		}
	}
	.bg_view {
		background-color: #fafafa;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
	}
}

.content1 {
	height: 100%;
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 28rpx;
		line-height: 48rpx;
		background-color: #fff;
		align-items: center;
		image {
			width: 76rpx;
			height: 76rpx;
			border-radius: 12rpx;
			flex: 0 0 76rpx;
		}
		&-name {
			padding-left: 20rpx;
		}
	}
}
</style>
