<!-- 发布朋友圈 -->
<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#F6F7F8' }" :border-bottom="false" back-icon-name="" back-text="取消" :back-text-style="{ color: '#404133' }">
			<view class="slot-wrap" slot="right"><u-button size="mini" type="success" @click="handleRelease" :disabled="$u.trim(this.content) ? false : true">发表</u-button></view>
		</u-navbar>
		<!-- #endif -->
		<textarea class="input" v-model="content" placeholder="这一刻的想法..." :show-confirm-bar="false" :adjust-position="false" :disable-default-padding="true"></textarea>
		<upload
			class="upload"
			ref="upload"
			:action="action"
			:max-size="maxSize"
			:max-count="3"
			:size-type="['compressed']"
			@on-success="getImgUrl"
			@on-remove="onRemove"
			@on-uploaded="isAdd = true"
			:before-upload="filterFileType"
		></upload>
		<view class="tips">
			<u-cell-group>
				<u-cell-item bg-color="#F6F7F8" title="所在位置" :title-style="{ marginLeft: '10rpx' }">
					<u-icon slot="icon" name="map" size="40"></u-icon>
				</u-cell-item>
				<u-cell-item bg-color="#F6F7F8" title="谁可以看" :title-style="{ marginLeft: '10rpx' }">
					<u-icon slot="icon" name="account" size="40"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import upload from '@/components/upload.vue';
export default {
	components:{upload},
	data() {
		return {
			content: '',
			action: this.$uploadUrl,
			maxSize: 2 * 1024 * 1024, //限制文件大小 2M
			btnLoading: false, //防止重复点击
			imgUrls: [],
			isAdd: true
		};
	},
	onShow() {},
	methods: {
		filterFileType(index, lists) {
			if (lists[index].fileType != 'jpg' && lists[index].fileType != 'png' && lists[index].fileType != 'gif') {
				lists.splice(index, 1);
				// 当前文件不支持
				uni.showModal({
					title: '暂不支持当前图片类型',
					showCancel: false
				});
			} else {
				this.isAdd = false;
			}
		},
		getImgUrl(res) {
			this.imgUrls.push(res.data);
		},
		onRemove(index) {
			this.imgUrls.splice(index, 1);
		},
		//自定义标题栏按钮 h5&&app
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				this.handleRelease();
			}
		},
		//自定义标题栏按钮点击事件  微信小程序
		handleRelease() {
			if (!this.isAdd) {
				uni.showModal({
					title: '图片未上传完成请稍后再试',
					showCancel: false
				});
			}
			if (this.$u.trim(this.content)) {
				this.btnLoading = true;
				uni.showLoading({
					title: '正在发布...',
					mask: true
				});
				let urls = '';
				for (let imgUrl of this.imgUrls) {
					urls += imgUrl + ',';
				}
				if (urls.length > 0) {
					urls.substring(0, urls.length - 1);
				}
				this.$socket.createPostReq(this.userData.user.operId, this.content, urls, res => {
					if (res.response.success) {
						uni.hideLoading();
						this.$u.route({ type: 'back' });
					} else {
						uni.showModal({
							title: '请求失败',
							showCancel: false
						});
					}
				});
			}
		}
	}
};
</script>
<style lang="scss">
.content {
	padding: 20rpx 40rpx;
	.input {
		caret-color: $uni-color-success;
		height: 160rpx;
		padding: 0 15rpx;
	}
	.tips {
		margin-top: 120rpx;
	}
	.upload {
		/deep/.u-list-item,
		.u-add-wrap {
			background-color: #eceae8;
		}
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
	}
}
</style>
