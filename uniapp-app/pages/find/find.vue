<template>
	<view class="content">
		<u-cell-group>
			<u-cell-item  title="朋友圈" :title-style="{marginLeft:'30rpx'}" @tap="linkToMoment">
				<u-icon slot="icon" name="moments" color="#409eff" size="40"></u-icon> 
			</u-cell-item>
		</u-cell-group>	
		<view style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item  title="扫一扫" :title-style="{marginLeft:'30rpx'}" @tap="linkToScan">
				<u-icon slot="icon" name="scan" color="#409eff" size="40"></u-icon> 
			</u-cell-item>
		</u-cell-group>	
		<view style="height: 10rpx;"></view>
		<view class="" v-for="(item,index) in links" :key="index">
			<u-cell-group>
				<u-cell-item  :title="item.title" :title-style="{marginLeft:'30rpx'}"  @tap="linkTo(item,index)">
					<u-icon slot="icon" :name="item.icon" :color="item.color" size="40"></u-icon> 
				</u-cell-item>
			</u-cell-group>
			<view v-if="index!=links.length" class="" style="height: 10rpx;"></view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
		};
	},
	onShow() {
		this.$socket.getLinks(this._user_info.id, res=>{
			this.$u.vuex('links',res.response.data)
		});
	},
	methods: {
		linkToMoment(){
			this.$u.route({
				url:'pages/firendCircle/firendCircle'
			})
		},
		linkToScan(){
			uni.scanCode({
				success: function(res) {
					uni.vibrateLong();
					let uId = res.result
					if (uId==t._user_info.id){
						uni.showToast({
							icon:'none',
							title:'暂不支持添加自己'
						})
					} else {
						t.$u.route({
							url: 'pages/businessCard/businessCard',
							params:{ id: uId, source: 2}
						})
					}
				}
			});
		},
		linkTo(item, index){
			this.$u.route({
				url:'pages/webview/webview',
				params:{url:item.url,name:item.title}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
	.content{
		
	}
</style>
