<template>
	<view>
		<addressBook :isSearch="true" :list="_members" @linkTo="memberFunc"></addressBook>
	</view>
</template>

<script>
	import addressBook from '@/components/addressBook.vue'
	export default {
		name:'call',
		components:{addressBook},
		data() {
			return {
				textMsg:'',
			};
		},
		onLoad({msg}) {
			this.textMsg = msg
		},
		methods:{
			memberFunc(e){
				const msg = this.textMsg + e.groupNickName + ' '
				this.$u.vuex('_textMsg', msg)
				uni.navigateBack();
			}
		}
	}
</script>

<style lang="scss">

</style>
