<template>
	<view>
		<view class="top">
			<view class="blessing">
				{{_redenvelope.description}}
			</view>
			<view class="money">
				{{_redenvelope.robMoney}}
			</view>
			<view class="face" :style="{'border-radius':radius}">
				<image :src="$url + _redenvelope.userAvatar"></image>
			</view>
			<view class="username">
				{{_redenvelope.userName}}的红包
			</view>
		</view>
		<view class="info">
			已领{{_redenvelope.number-_redenvelope.surplusNumber}}个，共{{_redenvelope.number}}个
		</view>
		<view class="list">
			<view class="row" v-for="(row,index) in _redenvelope.Records" :key="index">
				<view class="left">
					<image :src="$url + row.userAvatar"></image>
				</view>
				<view class="right">
					<view class="r1">
						<view class="username">
							{{row.userName}}
						</view>
						<view class="money">
							{{row.money}}元
						</view>
					</view>
					<view class="r2">
						<view class="time">
							{{row.lastUpdateTime}}
						</view>
						<view class="lucky" v-if="row.islucky">
							手气王
						</view>
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
				//动画效果
				radius:'100% 100% 0 0'
				
			};
		},
		onShow() {
			console.log(this._redenvelope);
		},
		onPageScroll(e) {
			//e.scrollTop;
			if(e.scrollTop>100){return;}
			let radiusTmp = 100 - e.scrollTop;
			this.radius = radiusTmp+'% '+radiusTmp+'% 0 0';
		}
	}
</script>

<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
	}
	.top{
		width: 100%;
		background-color: #cf3c35;
		flex-wrap: wrap;
		.blessing,.money{
			width: 100%;
			color: #f8d757;
			padding: 20upx 0;
			justify-content: center;
			font-size: 34upx;
			background: #cf3c35;
		}
		.money{
			font-size: 100upx;
		}
		.face{
			background-color: #fff;
			justify-content: center;
			width: 100%;
			height: 130upx;
			margin-top: 65upx;
			border-radius: 100% 100% 0 0;
			transition: border-radius .15s;
			image{
				width: 130upx;
				height: 130upx;
				border-radius: 100%;
				margin-top: -65upx;
			}
		}
		.username{
			width: 100%;
			justify-content: center;
			background-color: #fff;
			margin-top: -50upx;
			font-size: 38upx;
		}
	}
	.info{
		margin-top: 30upx;
		width: 96%;
		height: 50upx;
		padding-left: 4%;
		font-size: 28upx;
		color: #999;
		border-bottom: solid 1upx #dfdfdf;
	}
	.list{
		width: 100%;
		.row{
			width: 92%;
			padding: 0 4%;
			height: 120upx;
			border-bottom: solid 1upx #dfdfdf;
			justify-content:flex-start;
			flex-wrap: nowrap;
			.left{
				flex-shrink: 0;
				width: 100upx;
				height: 110upx;
				justify-content: flex-start;
				align-items: center;
				image{
					width: 80upx;
					height: 80upx;
					border-radius: 100%;
				}
			}
			.right{
				width: 100%;
				height: 100upx;
				
				.r1{
					width: 100%;
					height: 70upx;
					justify-content: space-between;
					align-items: center;
					font-size: 34upx;
				}
				.r2{
					width: 100%;
					height: 30upx;
					justify-content: space-between;
					font-size: 26upx;
					.time{
						color: #8F8F94;
					}
					.lucky{
						padding: 3upx 8upx;
						border-radius: 5upx;
						background-color: #F8D757;
						align-items: center;
						height: 30upx;
						font-size: 24upx;
						color: #CF3C35;
					}
				}
			}
		}
	}
</style>
