<template>
	<view>
		<addressBook :isSearch="true" :list="memberItem" @linkTo="memberLink"></addressBook>
	</view>
</template>

<script>
	import addressBook from '@/components/addressBook.vue'
	export default {
		name:'remind',
		components:{ addressBook },
		data() {
			return {
				textMsg:'',
			};
		},
		onLoad({msg}) {
			this.textMsg = msg
		},
		methods:{
			memberLink(e){
				// const msg = this.textMsg + e.groupNickName + ' '
				// this.$u.vuex('_textMsg', msg)
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">

</style>
