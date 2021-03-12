<template>
	<view>
		<view v-for="(item,index) in chatItem">
			<chatItem @linkTo="linkForward" :value="item" :index="index"></chatItem>
		</view>
	</view>
</template>

<script>
	import chatItem from '@/components/chatItem.vue'
	export default {
		name:'forward',
		components:{chatItem},
		data() {
			return {
				msgContext:'',
				msgType:0
			};
		},
		onShow(){
			this.$socket.queryChats('', this.userData.user.operId,(res) => {
				if (res.success) {
					this.$u.vuex('chatItem', res.chats)
				}
			});
		},
		onLoad({msgContext,msgType}) {
			this.msgContext = msgContext
			this.msgType = msgType
		},
		methods:{
			linkForward({chatId,chatType}){
				let action = chatType ==1 ? 'send2Group' : 'send2Friend'
				this.$socket[action](chatId, this.userData.user.operId, this.msgContext, this.msgType, res => {
					if (res.success) {
						uni.showToast({
							icon:'success',
							title:'转发成功'
						})
						this.$socket.createChatList(this.userData.user.operId, chatId, this.msgContext, this.msgType, res => {})
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
