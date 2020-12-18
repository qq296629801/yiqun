<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="false" title="消息" :background="{ background: '#F6F7F8'  }" title-color="#404133" :border-bottom="false" z-index="1001">
			<view class="slot-wrap" slot="right">
				<u-icon name="plus-circle" size="34" @click="showSelect"></u-icon>
			</view>		
		</u-navbar>
		<!-- #endif -->
		<selectInput :list="selectList" :list-key="'name'" :show.sync="selectShow" @on-select="checkSelect" @close="closeSelect" />
		<searchInput :searchType="1"/>
		<u-swipe-action style="margin-right: 1px;" :show="item.show" v-for="(item, index) in chatList" :index="index" btn-width="160" :key="item.id" @click="click(index,item.id)" @open="open" :options="options">
			<chatItem @linkTo="linkTo" :value="item" :index="index" :voiceIcon="true"></chatItem>
		</u-swipe-action>
	</view>
</template>

<script>
import searchInput from '@/components/searchInput/index.vue';
import selectInput from '@/components/selectInput/selectInput.vue';
import chatItem from '@/components/chatItem.vue'
export default {
	components: { searchInput, selectInput,chatItem },
	data() {
		return {
			selectShow: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
						fontSize: '24rpx'
					}
				}
			],
			selectList: [
				{ id: '1', name: '添加朋友', icon: 'man-add-fill' },
				{ id: '2', name: '扫一扫', icon: 'scan' },
				/* , { id: '3', name: '收付款', icon: 'fingerprint' } */
				]
		};
	},
	watch:{
        message_flush: function(value){
			this.getChats()
		}
	},
	onShow() {
		this.getChats()
	},
	onLoad(){
	},
	onPullDownRefresh() {
	        console.log('refresh');
	        setTimeout(function () {
	            uni.stopPullDownRefresh();
	        }, 100);
	    },
	methods: {
		linkTo(item){
			this.$u.vuex('chatObj', item)
			this.$u.route({
				url: 'pages/chat/chat',
				params: {}
			});
		},
		getChats(){
			this.$socket.queryChats('', this._user_info.id,(res) => {
				if (res.success) {
				  this.$u.vuex('chatList', res.chats)
				}
			});
		},
		//打开或者关闭弹窗
		showSelect(){
			this.selectShow = !this.selectShow;
		},
		//action 点击事件
		click(index, id) {
			this.chatList.splice(index, 1);
			this.$socket.delChat(this._user_info.id, id, (res) => {})
		},
		//action 打开事件
		open(index) {
			this.chatList[index].show = true;
			this.chatList.map((val, idx) => {
				if (index != idx) this.chatList[idx].show = false;
			});
		},
		//点击导航栏自定义按钮
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				this.showSelect()
			}
		},
		//关闭弹窗
		closeSelect(){
			//小程序兼容
			this.selectShow = false;
		},
		//扫码
		checkSelect(index) {
			if (index == 0) {
				this.$u.route({
					url:"pages/search/search",
					params: {searchType: 0}
				})
			}
			else if (index == 1) {
				//扫码
				const t = this
				uni.scanCode({
					success: function(res) {
						uni.vibrateLong();
						// console.log('条码内容：' + res.result);
						let uId = res.result
						if (uId==t._user_info.id){
							uni.showToast({
								icon:'none',
								title:'不能添加自己为好友'
							})
						} else {
							t.$u.route({
								url: 'pages/businessCard/businessCard',
								params:{ id: uId, source: 2}
							})
						}
					}
				});
			}
		},
	},
};
</script>
