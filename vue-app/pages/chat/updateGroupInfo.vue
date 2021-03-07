<template>
	<view>
		<u-navbar :is-back="true" :title="titles[type]" :background="{ background: '#F6F7F8' }" title-color="#404133" :border-bottom="false" z-index="1001">
			<view class="slot-wrap" slot="right">
				<u-button :disabled="isInput" size="mini" type="success" @click="save">保存</u-button>
			</view>
		</u-navbar>
		<u-cell-group>
			<u-input v-if="type=='0'" v-model="context" :auto-height="true" />
			<u-input v-if="type=='1'"  v-model="context" :auto-height="true" />
			<u-input v-if="type=='2'"  v-model="context" :auto-height="true" />
			<u-input v-if="type=='3'"  v-model="context"  :auto-height="true" />
		</u-cell-group>
	</view>
</template>
<script>
export default {
	data() {
		return {
			type:'0',
			context:'',
			groupId:'',
			value: '',
			isInput:true,
			show: false,
			border: false,
			titles: ['设置名字','群名称','群公告','群昵称']
		}
	},
	watch:{
		context:function(v){
			this.isInput = v==undefined ? true : false;
		}
	},
	onLoad({groupId, context, type}) {
		this.groupId = groupId
		this.context = context
		this.type = type
	},
	onShow() {
	},
	methods: {
		save(){
			
			switch(this.type){
				case '0':
					this.updateNickName();
					break;
				case '1':
					this.updateGroupName();
					break;
				case '2':
					this.updateNotice();
					break;
				case '3':
					this.updateGroupNick();
					break;
				default:
			}
		},
		updateNickName () {
			this.$socket.updateNickName(this.userData.user.operId, this.context, (res) => {
			  if (res.success) {
				 uni.showToast({
				 	title: '成功',
				 	duration: 2000,
				 });
			  }
			})
		},
		updateGroupName(){
			this.$socket.updateGroupName(this.userData.user.operId, this.groupId, this.context, res => {
				if(res.success){
					uni.showToast({
						title: '成功',
						duration: 2000,
					});
				}else{
					uni.showToast({
						title: '失败',
						duration: 2000,
					});
				}
			})
		},
		updateNotice(){
			this.$socket.updateNotice(this.userData.user.operId, this.groupId, this.context, res => {
				if(res.success){
					uni.showToast({
						title: '成功',
						duration: 2000,
					});
				}else{
					uni.showToast({
						title: '失败',
						duration: 2000,
					});
				}
			})
		},
		updateGroupNick(){
			this.$socket.updateGroupNick(this.userData.user.operId, this.groupId, this.context, res => {
				if(res.success){
					uni.showToast({
						title: '成功',
						duration: 2000,
					});
				}else{
					uni.showToast({
						title: '失败',
						duration: 2000,
					});
				}
			})
		}
	}
};
</script>

<style></style>
