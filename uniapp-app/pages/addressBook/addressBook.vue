<template>
	<view class="content">
		<searchInput :searchType="2"/>
		<addressBook :list="this.firendList" :scrollTop="scrollTop" :isShowMenu="true" @linkTo="linkToCard"></addressBook>
	</view>
</template>
<script>
import searchInput from '@/components/searchInput/index.vue'
import addressBook from '@/components/addressBook.vue'
import { openFSqlite, createFSQL, selectFSQL, addFSQL } from '../../util/f.js'
export default {
	components:{searchInput, addressBook},
	data() {
		return {
			scrollTop: 0
		};
	},
	onShow() {
	    this.getFriends(false)
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onPullDownRefresh() {
		this.getFriends(true)
	},
	methods: {
		getFriends (freshFlag) {
		  // #ifndef H5
		  var list = []
		  selectFSQL(this._user_info.id).then(res=>{
		  	this.indexList.forEach(name=>{
		  		var members = []
		  		res.forEach(f=>{
		  			if(f.name===name){
		  				members.push(f);
		  			}
		  		})
		  		let obj = {
		  			name:name,
		  			members:members
		  		}
		  		list.push(obj);
		  	})
		  	this.$u.vuex('firendList', list)
			if(freshFlag){
				uni.stopPullDownRefresh();
			}
		  });
		  // #endif	
		  // #ifndef APP-PLUS
		  this.$socket.listGuests(this._user_info.id, res => {
			this.$u.vuex('firendList', res.response.data)
			if(freshFlag){
				uni.stopPullDownRefresh();
			}
		  })
		  // #endif
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
