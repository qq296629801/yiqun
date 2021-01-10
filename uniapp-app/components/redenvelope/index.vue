<template>
	<view>
		<view class="tabr">
			<view :class="{on:typeClass=='luck'}" @tap="switchType('luck')">拼手气红包</view><view :class="{on:typeClass=='normal'}"  @tap="switchType('normal')">普通红包</view>
			<view class="border" :class="typeClass"></view>
		</view>
		<view class="content" :class="typeClass">
			<view class="luck">
				<view class="row">
					<view class="term">
						红包个数
					</view>
					<view class="input">
						<input type="number" v-model="redPacket.number" placeholder="输入红包个数"  /> 个
					</view>
				</view>
				<view class="row">
					<view class="term">
						总金额
					</view>
					<view class="input">
						<input type="number" v-model="redPacket.money" placeholder="输入金额" /> 元
					</view>
				</view>
				<view class="tis">
					小伙伴领取的金额随机
				</view>
				<view class="blessing">
					<input type="text" maxlength="12" placeholder="恭喜发财" v-model="redPacket.title"  />
				</view>
				<view class="hand" @tap="hand('luck')">
					发红包
				</view>
			</view>
			<view class="normal">
				<view class="row">
					<view class="term">
						红包个数
					</view>
					<view class="input">
						<input type="number" v-model="redPacket.number" placeholder="输入红包个数" /> 个
					</view>
				</view>
				<view class="row">
					<view class="term">
						单个金额
					</view>
					<view class="input">
						<input type="number" v-model="redPacket.money" placeholder="输入金额" /> 元
					</view>
				</view>
				<view class="tis">
					小伙伴领取的金额相同
				</view>
				<view class="blessing">
					<input type="text" maxlength="12" placeholder="恭喜发财" v-model="redPacket.title"  />
				</view>
				<view class="hand" @tap="hand('normal')">
					发红包
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'red-envelope',
		data() {
			return {
				typeClass:'luck',//normal
				redPacket: {
					title: '恭喜发财,大吉大利',
					money: 0.00,
					number: 0,
					status: 0
				}
			};
		},
		methods:{
			switchType(type){
				this.typeClass = type;
			},
			hand(type){
				//判断数据有效性
				if((!this.redPacket.money)||this.redPacket.money<=0)
				{
					return uni.showToast({title:"金额不能为空",icon:'none'});
				}
				if(this.redPacket.number!=Math.abs(parseInt(this.redPacket.number))){
					return uni.showToast({title:"数量填写大于0的整数",icon:'none'});
				}
				this.redPacket.title = this.redPacket.title ||'恭喜发财';
				//没填写则默认恭喜发财
				this.$emit('handTo',this.redPacket)
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F6F7F8;
	}
	view{
		display: flex;
		flex-wrap: wrap;
	}
	.tabr{
		width: 94%;
		height: 105upx;
		padding: 0 3%;
		margin-top: 80rpx;
		border-bottom: solid 1upx #dedede;
		view{
			width: 50%;
			height: 100upx;
			justify-content: center;
			align-items: center;
			font-size: 28upx;
			color: #999;
		}
		.on{
			color: #cf3c35;
		}
		.border{
			height: 4upx;
			background-color: #cf3c35;
			transition: all .3s ease-out;
			&.normal{
				transform: translate3d(100%,0,0);
			}
		}
		
	}
	.content{
		width: 100%;
		height: 80vh;
		overflow: hidden;
		&.normal{
			.luck{
				transform: translate3d(-100%,0,0);
			}
			.normal{
				transform: translate3d(0,-100%,0);
			}
		}
		.luck,.normal{
			
			transition: all .3s ease-out;
		}
		.luck{
			
		}
		.normal{
			transform: translate3d(100%,-100%,0);
		}
		.row,.tis,.blessing,.hand{
			width: 94%;
		}
		.row,.tis,.blessing{
			border-bottom: #dedede solid 1upx;
		}
		.row,.blessing{
			padding: 0 3%;
			background-color: #fff;
		}
		.row,.blessing,.hand{
			height: 100upx;
			align-items: center;
		}
		.row{
			justify-content: space-between;
			flex-wrap: nowrap;
			.term,.input{
				width: 50%;
			}
			.input{
				flex-shrink: 0;
				flex-wrap: nowrap;
				justify-content: flex-end;
				align-items: center;
				input{
					height: 50upx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					text-align: right;
					margin-right: 20upx;
					font-size: 30upx;
				}
			}
		}
		.tis{
			height: 60upx;
			padding: 20upx 3%;
			font-size: 30upx;
			color: #999;
		}
		.blessing{
			input{
				width: 100%;
				height: 50upx;
				font-size: 32upx;
			}
		}	
		.hand{
			margin: 30upx 3%;
			background-color: #cf3c35;
			color: #fff;
			font-size: 34upx;
			justify-content: center;
			border-radius: 10upx;
			height: 90upx;
		}
	}
		
</style>
