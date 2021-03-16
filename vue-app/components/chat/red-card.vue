<template>
	<view>
		<!-- 红包弹窗 -->
		<view class="windows" :class="windowsState">
			<!-- 遮罩层 -->
			<view class="mask" @touchmove.stop.prevent="discard" @tap="closeRedEnvelope"></view>
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
							<view class="icon close" @tap="closeRedEnvelope"></view>
						</view>
						<template v-if="packet.Records">
							<template v-for="(r,index) in packet.Records">
								<view v-if="r.robUid===userData.user.operId">
								</view>
								<view v-else class="img" @tap="robRed">开</view>
							</template>
							<template v-if="packet.Records.length==0">
								<view class="img" @tap="robRed">开</view>
							</template>
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
			windowsState: {
				type: String,
				default: ''
			},
			packet: {
				type: Object,
				default() {
					return {};
				}
			},
		},
		methods:{
			discard(){
				return;
			},
			//领取详情
			toDetails(){
				this.$u.vuex('_redenvelope',this.packet)
				uni.navigateTo({
					url:'./detail'
				})
			},
			robRed(){
				this.$emit('robRed',true);
			},
			// 关闭红包弹窗
			closeRedEnvelope(){
				this.$emit("closeRedEnvelope", true)
			},
		}
	}
</script>

<style lang="scss">
@import "@/pages/chat/style.scss";
</style>
