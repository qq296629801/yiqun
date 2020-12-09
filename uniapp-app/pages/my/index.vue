<template>
	<view>
		<u-navbar :is-back="false" title="　" :border-bottom="false">
			<view class="u-flex u-row-right" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="camera-fill" color="#000000" size="48"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="`${$url}/${_user_info.avatar}`" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{_user_info.nickName}}</view>
				<view class="u-font-14 u-tips-color">积分: {{_user_info.money}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="heart" title="关注"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic:'',
				show:true
			}
		},
		onLoad() {
			
		},
		methods: {
			linkTo(index) {
				const url = index == 1 ? 'pages/my/face' : 'pages/my/photo'
				this.$u.route({
					url: url
				});
			},
			linkToSetting() {
				this.$u.route({
					url: 'pages/setings/setings'
				});
			},
			linkToPerson() {
				this.$u.route({
					url: 'pages/my/person'
				});
			},
			previewImage() {
				let current = this.$url + this._user_info.avatar
				uni.previewImage({
					current,
					urls: [current],
					// #ifndef MP-WEIXIN
					indicator: 'number'
					// #endif
				});
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
