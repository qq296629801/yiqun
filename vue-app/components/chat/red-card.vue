<template>
	<view>
		<!-- 红包弹窗 -->
		<view class="windows" :class="winState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRed"></view>
			<view class="layer" @touchmove.stop.prevent="discard">
				<view class="open-redenvelope">
					<view class="from">
						<image :src="this.$url + packet.userAvatar"></image>  
						{{ packet.userName }}的红包
					</view>
					<template v-if="packet.Records">
						<template v-for="(r,index) in packet.Records">
							<view class="money" v-if="r.robUid===userData.user.operId">
								{{r.money}}
							</view>
						</template>
					</template>
					<view class="blessing">恭喜发财，大吉大利</view>
					<view class="top">
						<view class="close-btn">
							<view class="icon close" @tap="closeRed"></view>
						</view>
						<template v-if="packet.Records">
							<view v-if="!xxx()" class="img" @tap="robRed">开</view>
							<view v-else-if="packet.Records.length===0" class="img" @tap="robRed">开</view>
						</template>
					</view>
					<view class="showDetails" @tap="toDetails">
						查看领取详情
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'red-card',
		data() {
			return {
			};
		},
		props: {
			winState: {
				type: String,
				default: ''
			},
		},
		methods:{
			xxx(){
				let isRob = false;
				for(var i in this.packet.Records){
					if(this.packet.Records[i].robUid === this.userData.user.operId){
						isRob = true;
					}
				}
				return isRob;
			},
			discard(){
				return;
			},
			toDetails(){
				this.$u.vuex('packet',this.packet)
				uni.navigateTo({
					url:'./detail'
				})
			},
			robRed(){
				this.$emit('robRed',true);
			},
			closeRed(){
				this.$emit("closeRed", true)
			},
		}
	}
</script>

<style lang="scss">
@import "@/pages/chat/style.scss";
</style>
