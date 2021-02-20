<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="false" title="我的" :background="{ background: '#ffffff'  }" :border-bottom="false"></u-navbar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="status_bar"></view>
		<!-- #endif -->
		<view class="header">
			<view class="header_left">
				<u-avatar @tap="previewImage" :src="`${$url}/${_user_info.avatar}`" mode="square" size="100"></u-avatar>
				<view class="header_left_content">
					<view class="header_left_content_name">{{_user_info.nickName}}</view>
					<view class="header_left_content_number">{{_user_info.money}}</view>
				</view>
			</view>
			<view class="header_right" @tap="linkToPerson">
				<u-icon style="position: relative;right: 20rpx;top: 10rpx;" :name="src1" size="40" :color="$u.color['lightColor']"></u-icon>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item @tap="linkTo(index)" v-for="(item, index) in groupList" :key="index" :title="item.title" :title-style="{ marginLeft: '30rpx' }">
				<u-icon slot="icon" :name="item.icon" :color="item.color" size="40"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<view style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item title="设置" @click="linkToSetting" :title-style="{ marginLeft: '30rpx' }">
				<u-icon slot="icon" name="setting" color="#409eff" size="40"></u-icon>
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src1: require('@/static/qrcode.png'),
				groupList: [
					/* { title: '收藏', color: '#409eff', icon: 'star' }, */
					{
						title: '相册',
						color: '#50E3C2',
						icon: 'photo'
					},
					/* { title: '卡包', color: '#409eff', icon: 'coupon' }, */
					{
						title: '表情',
						color: '#ff9900',
						icon: 'heart'
					}
				],
			};
		},
		onPullDownRefresh() {
			 setTimeout(function () {
				 wx.stopPullDownRefresh()
			 }, 500)
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
	};
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 120rpx 38rpx;
		background-color: #ffffff;

		&_left {
			display: flex;
			align-items: center;

			&_content {
				padding-left: 20rpx;

				&_name {
					font-weight: bold;
					font-size: 36rpx;
				}

				&_number {
					color: #969799;
					font-size: 28rpx;
					padding-top: 16rpx;
				}
			}
		}

		&_right {
			font-size: 28rpx;
			color: #969799;
		}

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 6rpx;
		}
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
</style>
