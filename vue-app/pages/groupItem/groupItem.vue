<template>
	<view class="content">
		<view v-for="(value, index) in list">
			<view class="item u-border-bottom" :class="currIndex ===index ? 'bg_view' : ''" hover-class="message-hover-class" 
			@tap="link(value)">
				<img-cache :src="`${$url}/${value.avatar || value.imgUrl}`"></img-cache>
				<view class="right title-wrap">
					<view class="right_top">
						<view class="right_top_name u-line-1">{{ value.chatName }}</view>
						<view class="right_top_time ">{{value.lastOperTime || value.lastOpenTime | format}}</view>
					</view>
					<view class="right_btm ">
						<view class="u-line-1">{{value.desc}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {
	},
	data() {
		return {
			list: [],
			currIndex: -1
		};
	},
	onLoad() {
	},
	onShow() {
		this.query(false);
	},
	onPullDownRefresh() {
		this.query(true)
	},
	methods: {
		link(item,index) {
			this.currIndex = index;
			this.$u.vuex('chatObj', item);
			this.$u.route({url: 'pages/chat/chat'});
		},
		query(freshFlag) {
			this.$socket.getGroups('', this.userData.user.operId, res => {
				this.list = res.response.data;
				if(freshFlag){
					uni.stopPullDownRefresh();
				}
			});
		}
	},
	filters: {
	   format: function (e) {
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
		   return h+m+ss;
		  }  
	   }
	},
};
</script>

<style lang="scss">
	.content{
		background-color: #fff;
	}
	.item {
			width: 750rpx;
			height: 140rpx;
			display: flex;
			align-items: center;
			image {
				width: 96rpx;
				height: 96rpx;
				margin: 20rpx;
				border-radius: 12rpx;
				flex: 0 0 96rpx;
			}
			.right {
				overflow: hidden;
				flex: 1 0;
				padding: 20rpx 20rpx 40rpx 0;
				&_top {
					display: flex;
					justify-content: space-between;
					&_name {
						font-size: 28rpx;
						font-weight: 800;
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
</style>
