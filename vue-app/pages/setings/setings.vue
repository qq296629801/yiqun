<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="false" title=" " :background="{ background: '#ffffff'  }" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="status_bar"></view>
		<!-- #endif -->
		<u-cell-group>
			<u-cell-item title="账号与安全" @click="linkToAccount" :title-style="{ marginLeft: '10rpx' }"></u-cell-item>
		</u-cell-group>
		<view  style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item @click="linkToCommon(index)" v-for="(item, index) in groupList" :key="index" :title="item.title" :title-style="{ marginLeft: '10rpx' }">
			</u-cell-item>
		</u-cell-group>
		<view  style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item @tap="upApp" title="检查更新" :title-style="{ marginLeft: '10rpx' }">
			</u-cell-item>
		</u-cell-group>
		<!--<view  style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item :arrow="false">
				<view style="text-align: center;">切换账号</view>
			</u-cell-item>
		</u-cell-group>-->
		<view  style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item :arrow="false" @click="logout">
				<view style="text-align: center;">退出登录</view>
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import apiconfig from '../../apiconfig.js'
	export default {
		data() {
			return {
				groupList: [
					/* { title: '新消息通知', color: '#409eff', icon: 'star' }, */
					/* { title: '隐私', color: '#409eff', icon: 'photo' }, */
					{ title: '通用', color: '#409eff', icon: 'coupon' },
					/* { title: '帮助与反馈', color: '#ff9900', icon: 'heart' } */
				],
			}
		},
		methods: {
			linkToCommon(index){
				this.$u.route({
					url: 'pages/my/common'
				});
			},
			linkToAccount(){
				this.$u.route({
					url: 'pages/my/accountSafe'
				});
			},
			logout(){
				uni.clearStorageSync();
				this.$u.route({
					url: 'pages/login/loginV2'
				});
			},
			upApp(){
                // #ifdef APP-PLUS
                plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					apiconfig.getCheckVersion({}).then(res=>{
						if(widgetInfo.version == res.data.data.version){
							uni.showToast({
								icon:"none",
								duration:2000,
								title:'暂无版本更新'
							})
							return;
						}
						uni.showLoading({
							title:'下载中....'
						})
						uni.downloadFile({
						    url: res.data.data.android,
						    success: (downloadResult) => {
						        if (downloadResult.statusCode === 200) {
						            plus.runtime.install(downloadResult.tempFilePath, {
						                force: false
						            }, function() {
						                plus.runtime.restart();
										uni.hideLoading()
						            }, function(e) {
										uni.hideLoading()
						            });
						        }
						    },
							fail: (res) =>{
								uni.showToast({
									icon:"none",
									duration:2000,
									title:res
								})
							}
						});
					});
                });
                // #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
