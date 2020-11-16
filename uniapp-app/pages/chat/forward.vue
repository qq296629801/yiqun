<template>
	<view>
		<view v-for="(item,index) in chatList">
			<chatItem @linkTo="linkToForward" :value="item" :index="index"></chatItem>
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
			this.$socket.queryChats('', this._user_info.id,(res) => {
				if (res.success) {
					this.$u.vuex('chatList', res.chats)
				}
			});
		},
		onLoad({msgContext,msgType}) {
			this.msgContext = msgContext
			this.msgType = msgType
		},
		methods:{
			linkToForward({chatId,chatType}){
				let action = chatType ==1 ? 'send2Group' : 'send2Friend'
				this.$socket[action](chatId, this._user_info.id, this.msgContext, this.msgType, res => {
					if (res.success) {
						uni.showToast({
							icon:'success',
							title:'转发成功'
						})
						this.$socket.createChatList(this._user_info.id, chatId, this.msgContext, this.msgType, res => {})
					}
				});
			}
		}
	}
</script>

<style lang="scss">

</style>
