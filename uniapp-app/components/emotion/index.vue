<template>
	<view class="emotion-wrap">
		<view class="emotion-btn">
			<u-button class="emotion-del" size="mini" @tap="handleRemoveEmoji">删除</u-button>
			<u-button size="mini" type="success" @tap="handleSend">发送</u-button>
		</view>
		<swiper class="swiper-wrap" indicator-dots="true" duration="150">
			<swiper-item v-for="(page,pid) in list" :key="pid">
				<view class="emotion-box">
					<view v-for="(em,eid) in page" :key="eid" @tap="handleClikEmoji(em)">
						<u-image class="emotion" width="70rpx" height="70rpx" :src="`/static/img/face/${em.url}`"></u-image>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		emojiList
	} from "@/static/emoji/emoji.js"
	export default {
		name:'u-emotion',
		data() {
			return {
				list: emojiList,
				cur: {}
			}
		},
		methods: {
			handleSend() {
				this.$emit('send')
			},
			handleRemoveEmoji() {
				this.$emit('addEmoji', this.cur, true)
			},
			handleClikEmoji(item) {
				this.cur = {
					emojiPath: '/static/img/face/',
					minEmoji: true,
					emojiItem: item,
					groupIndex: 1,
					emoticonFlag: false
				}
				this.$emit('addEmoji', this.cur)
			}
		}
	}
</script>

<style lang="scss">
	.emotion-wrap {
		height: 100%;
		padding-left: 2%;
		padding-bottom: 20px;
		overflow: auto;
		
		.emotion-box {
			padding-top: 30px;
		}
		
		.swiper-wrap {
			height: 100%;
		}

		.emotion-btn {
			z-index: 1;
			position: fixed;
			right: 20rpx;
			bottom: 30rpx;
		}

		.emotion-del {
			margin-right: 10rpx;
		}

		.emotion {
			float: left;
			margin: 5px;
		}
	}
</style>
