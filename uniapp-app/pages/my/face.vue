<template>
	<view>
		<u-search v-model="keyword" @change="search" placeholder="搜索" shape="square" :show-action="false" :bg-color="'#ffffff'"></u-search>
		<view  style="height: 10rpx;"></view>
		<u-swiper :list="list"></u-swiper>
		<view class="title">精选</view>
		<view class="item bg_view" v-for="(item, index) in faces" hover-class="message-hover-class">
			<image mode="aspectFill" :src="item.faceUrl" />
			<view class="right u-border-bottom title-wrap">
				<view class="right_top">
					<view class="right_top_name u-line-1">{{item.faceName}}</view>
				</view>
				<view class="right_btm ">
					<view class="u-line-1">{{item.faceDesc}}</view>
					<view class="">
						<u-button :plain="true" type="success" size="mini" v-on:click="addFaceUser(item.id)">添加</u-button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword:'',
				list: [],
				faces:[]
			};
		},
		watch:{},
		methods:{
			addFaceUser(faceId){
				this.$socket.addFaceUser(this.userData.user.operId, faceId, res=>{
					if(res.success){
						uni.showToast({
							title:'添加成功',
							icon:'success'
						})
					}
				})
			},
			search(){
				this.$socket.listFaces(this.keyword,res=>{
					this.faces = res.response.data
				})
			}
		},
		onShow() {
			this.search()
			this.$socket.listBanner(res=>{
				this.list = res.response.data
			})
		}
	}
</script>

<style lang="scss">
.title{
	height: 80rpx;
	background-color: #fff;
	font-size: 30rpx;
	padding: 10rpx;
}
.item {
		width: 750rpx;
		display: flex;
		align-items: center;
		image {
			width: 120rpx;
			height: 120rpx;
			margin: 20rpx;
			border-radius: 12rpx;
			//flex: 0 0 76rpx;
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
</style>
