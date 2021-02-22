<template>
	<view>
		<u-index-list :scrollTop="scrollTop" :index-list="indexList" :active-color="'#3CC51F'">
			<view v-if="isShowMenu">
				<u-index-anchor index="#" />
				<view class="list-cell" hover-class="message-hover-class" @click="linkToNewFriend">
					<u-image width="70rpx" height="70rpx" src="/static/image/friend_1.png"></u-image>
					<view class="list-cell-name">新的朋友</view>
				</view>
				<view class="list-cell " hover-class="message-hover-class"  @click="linkToGroupItem">
					<u-image width="70rpx" height="70rpx" src="/static/image/group_1.png"></u-image>
					<view  class="list-cell-name">我的群聊</view>
				</view>
			</view>
			<view v-if="isSearch">
				<u-index-anchor index="#" />
				<view class="list-cell" hover-class="message-hover-class">
					<u-search v-model="keyword" placeholder="搜索" shape="square" :show-action="false" :bg-color="'#ffffff'"></u-search>
				</view>	
			</view>
			<view v-for="(item, index) in list" :key="index">
				<u-index-anchor :index="item.name" v-if="item.members&&item.members.length"/>
				<view v-for="user in item.members" :key="user.id"  class="list-cell " @tap="linkToCard(user)" hover-class="message-hover-class">
					<img-cache :src="`${$url}/${user.avatar}`"></img-cache>
					<view  class="list-cell-name">{{user.nickName}}</view>
				</view>
			</view>
		</u-index-list>
	</view>
</template>

<script>
	import ImgCache from '@/components/img-cache/img-cache.vue';
	export default {
		name:'u-addressBook',
		components:{ ImgCache },
		props:{
			list:{
				type:Array,
				default () {
					return [];
				}
			},
			isShowMenu:{
				type: Boolean,
				default () {
					return false;
				}
			},
			isSearch:{
				type: Boolean,
				default () {
					return false;
				}
			},
			scrollTop:{
				type:Number,
				default: 0
			}
		},
		watch:{
			keyword:function(val){
				let arr = this.tList;
				if(val!=''){
					this.list = arr.filter(v => {
						let flag = false
						if(v.members.length>0){
							v.members.forEach(m=>{
								if(m.groupNickName.includes(val)){
									flag = true
								}
							})
						}
						return flag
					})
				}else {
					this.list = this.tList
				}
			}
		},
		data() {
			return {
				tList: this.list,
				keyword:'',
				url1:require('@/static/image/friend_1.png'),
				url2:require('@/static/image/group_1.png'),
				indexList: ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
			};
		},
		methods:{
			linkToCard(user){
				this.$emit('linkTo',user);
			},
			linkToNewFriend(){
				this.$u.route({
					url: 'pages/newFriend/newFriend'
				});
			},
			linkToGroupItem(){
				this.$u.route({
					url: 'pages/groupItem/groupItem'
				});
			}
		}
	}
</script>

<style lang="scss">
.list-cell {
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 10px 24rpx;
	overflow: hidden;
	color: #323233;
	font-size: 28rpx;
	font-weight: 800;
	line-height: 48rpx;
	background-color: #fff;
	border-bottom: solid 3rpx #eeeeee;
	align-items: center;
	image {
		width: 76rpx;
		height: 76rpx;
		border-radius: 12rpx;
		flex: 0 0 76rpx;
	}
	&-name{
		padding-left: 20rpx;
	}
}
</style>
