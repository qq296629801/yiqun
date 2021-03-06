<template>
	<view class="content-addGroupUser">
		<u-navbar :is-back="true" title="选择好友" :background="{ background: '#F6F7F8' }" title-color="#404133" :border-bottom="false"
		 z-index="1001">
			<view class="slot-wrap" slot="right">
				<u-button size="mini" type="success" @click="saveGroupMember">保存</u-button>
			</view>
		</u-navbar>
		<view class="list-search">
			<u-search v-model="keyword" placeholder="搜索" shape="square" :show-action="false" :bg-color="'#ffffff'"></u-search>
		</view>
		<u-index-list class="list-box" :scrollTop="scrollTop" :indexList="indexList">
			<view class="list-wrap" v-if="item.members.length" v-for="(item, index) in fList" :key="index">
				<u-index-anchor :index="item.name" />
				<u-checkbox-group style="width: 100%;">
					<view class="member-list u-border-bottom list-cell" v-for="(user, jndex) in item.members" :key="jndex">
						<u-checkbox @change="checkboxChange(user)" v-model="user.checked" :name="user.id">
							<u-avatar class="my-avatar" :src="$url + user.avatar" mode="square" size="60"></u-avatar>
						</u-checkbox>
						{{ user.groupNickName }}
					</view>
				</u-checkbox-group>
			</view>
		</u-index-list>
	</view>
</template>
<script>
	import chatItem from '../../components/chatItem.vue'
	import searchInput from '@/components/searchInput/index.vue';
	export default {
		components: {
			searchInput
		},
		data() {
			return {
				scrollTop: 0,
				indexList: [],
				ids: [],
				userNames: [],
				fList: [],
				keyword: ''
			}
		},
		onShow() {
			this.queryGuests();
		},
		onLoad(option) {},
		watch: {
			keyword: function(val) {
				let arr = this.firendList;
				if (val != '') {
					console.log(val)
					this.fList = arr.filter(v => {
						let flag = false
						if (v.members.length > 0) {
							v.members.forEach(m => {
								if (m.groupNickName.includes(val)) {
									flag = true
								}
							})
						}
						return flag
					})
				} else {
					this.fList = this.firendList
				}
			}
		},
		methods: {
			saveGroupMember() {
				let type = this.$route.query.type
				if (type === '1') {
					let defaultGroupName = this.userNames.length > 8 ? this.userNames.substr(0, 8) + '...' : this.userNames
					this.$socket.createGroup(this.ids, defaultGroupName, this.userData.user.operId, res => {
						if (res.success) {
							this.$u.route({
								url: 'pages/home/home'
							});
						}
					});
				}
				if (type === '2') {
					this.$socket.joinGroup(this.chatObj.chatId, this.ids, this.userData.user.username, res => {
						if (res.success) {
							this.$u.route({
								url: 'pages/chat/groupDetail'
							});
						}
					});
				}
			},
			checkboxChange(user) {
				if (user.checked) {
					this.ids.push(user.id);
					this.userNames.push(user.chatName);
				} else {
					this.ids.splice(this.ids.indexOf(user.id), 1);
					this.userNames.splice(this.userNames.indexOf(user.chatName), 1);
				}
			},
			queryGuests() {
				this.$socket.listGuests(this._user_info.id, res => {
					this.$u.vuex('firendList', res.response.data);
					this.fList = res.response.data
					let indexList = []
					this.fList.forEach(item => {
						indexList.push(item.name)
					})
					this.indexList = indexList
				});
			},
			linkToCard({
				id
			}) {
				this.$u.route({
					url: 'pages/businessCard/businessCard',
					params: {
						id: id,
						source: 1
					}
				});
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	};
</script>

<style lang="scss">
	.content-addGroupUser {
		height: 100%;

		.list-search {
			padding: 0 24rpx;
			margin-top: 24rpx;
		}

		/deep/.u-index-anchor {
			background: #F6F7F8;
		}

		/deep/.u-checkbox__label {
			display: flex;
		}

		.list-wrap {
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			width: 100%;
			overflow: hidden;
			color: #323233;
			font-size: 14px;
			line-height: 24px;
			background-color: #fff;
		}
		.member-list {
			padding: 24rpx;
			display: flex;
			align-items: center;
		}
		
		.u-checkbox-group {
			flex-direction: column;
		}
	}
</style>
