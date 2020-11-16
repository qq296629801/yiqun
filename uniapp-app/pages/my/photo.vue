<template>
	<view style="margin-left: 40rpx;">
		<u-time-line>
			<u-time-line-item nodeTop="2" v-for="(item, index) in posts">
				<template v-slot:node>
					<view class="u-node" style="background: #19be6b;">
						<view style="color: #fff;">{{item.operTime|formatData}}</view>
					</view>
				</template>
				<template v-slot:content>
					<view>
						<view class="u-order-title"></view>
						<view class="u-order-desc">
							<view v-for="(img,jdex) in item.urls.split(',')" @tap="openBigImg(index, item.urls.split(','))">
								<image style="width: 200rpx;height: 200rpx;" :src="$url + img"></image>
							</view>
						</view>
						<view class="u-order-time">{{item.operTime|format}}</view>
					</view>
				</template>
			</u-time-line-item>
		</u-time-line>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNum:1,
				posts:[],
			};
		},
		methods:{
			getPhotos(){
				this.$socket.queryPostsReq(this._user_info.id, this.pageNum, res => {
					this.posts = res.response.data.filter(p=>p.urls!='');
				});
			},
			openBigImg(current, imgList){
				for(let index in imgList){
					if(!imgList[index]){
						imgList.splice(index, 1)
					}else{
						imgList[index] = this.$url + imgList[index]
					}
				}
				uni.previewImage({
					current,
					urls: imgList,
					// #ifndef MP-WEIXIN
					indicator: 'number'
					// #endif
				});
			}
		},
		filters:{
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
					   var D = date.getDate()>10?date.getDate(): '0'+date.getDate() + ' ';
					   var h = date.getHours() + ':';
					   var m = date.getMinutes()>10?date.getMinutes():'0'+ date.getMinutes() + ':';
					   var ss = date.getSeconds();
					   return Y+M+D+h+m+ss;
					  }  
			},
			formatData: function (e) {
			   var date = new Date(e);
			   //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			   var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
			   return M;
			}
		},
		onShow() {
			this.getPhotos();
		}
	}
</script>

<style lang="scss">
	.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}
	
	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 32rpx;
	}
	
	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
		display: flex;
		justify-content: center;
	}
	
	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}
</style>
