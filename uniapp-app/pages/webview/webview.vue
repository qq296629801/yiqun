<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'http://baidu.com'
			};
		},
		onLoad({url,name}) {
			this.url = url
			uni.setNavigationBarTitle({
				title: name
			});
		}
	}
</script>

<style lang="scss">

</style>
