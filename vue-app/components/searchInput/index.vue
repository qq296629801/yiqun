<template>
	<view class="content_search  u-border-bottom">
		<view @tap="clickInput">
			<u-search placeholder="搜索" shape="square" :show-action="false" :bg-color="'#ffffff'" :disabled="true"></u-search>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		searchType: {
			type: Number,
			default() {
				return 0;
			}
		},
	},
	data() {
		return {
			
		};
	},
	methods: {
		clickInput() {
			this.$u.route({
				url:"pages/search/search",
				params: {searchType: this.searchType}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.content_search {
	padding: 16rpx;
	background-color: #F6F7F8;
}
</style>
