<template>
	<view class="content">
		<searchInput :searchType="2"/>
		<addressBook :list="this.firendList" :scrollTop="scrollTop" :isShowMenu="true" @linkTo="linkToCard"></addressBook>
	</view>
</template>
<script>
import searchInput from '@/components/searchInput/index.vue'
import addressBook from '@/components/addressBook.vue'	
export default {
	components:{searchInput, addressBook},
	data() {
		return {
			scrollTop: 0
		};
	},
	onShow() {
	  this.getFriends()
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		getFriends () {
		  this.$socket.listGuests(this._user_info.id, res => {
			this.$u.vuex('firendList', res.response.data)
		  })
		},
		linkToCard({id}){
			this.$u.route({
				url: 'pages/businessCard/businessCard',
				params:{ id: id, source: 1}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	height: 100%;
}
</style>
