<template>
<div class="user-box-wrap">
    <div class="user-box-list">
        <Input clearable prefix="ios-search" clearable v-model="search" placeholder="搜索" size="small" class="search" />
        <div class="group-box">
            <Collapse simple>
                <template v-for="(item, index) in items">
                    <Panel v-if="item.members.length" :key="index" :name="`${index}`">
                        <span class="group-head">
                            <span>{{item.name}}</span>
                            <span class="my-num">{{item.members.length}}</span>
                        </span>
                        <div slot="content" class="group-wrap">
                            <div class="con-item" v-for="(m, n) in item.members" :key="n" @click="showUser(m)">
                                <img class="member-img" :src="`${$url}/${m.avatar}`" />
                                <span>{{ m.groupNickName }}</span>
                            </div>
                        </div>
                    </Panel>
                </template>
            </Collapse>
        </div>
    </div>
    <div class="chat-box">
        <Top></Top>
        <UserInfo class="user-box-view" v-if="member" :user="member"></UserInfo>
        <Welcome v-else></Welcome>
    </div>
</div>
</template>

<script>
import Top from '../components/top.vue';
import Welcome from '../components/welcome.vue';
import UserInfo from '../components/userInfo.vue';
import moment from 'moment';
export default {
    components: {
        Top,
        Welcome,
        UserInfo
    },
    computed: {
        friends: {
            get: function () {
                return this.$store.state.friends;
            },
            set: function (friends) {
                this.$store.commit('setFriends', friends);
                this.items = friends
                this.list = friends
            }
        },
        member: {
            get: function () {
                return this.$store.state.member;
            },
            set: function (mem) {
                this.$store.commit('setMember', mem);
            }
        }
    },
    data() {
        return {
            list: [],
            search: '',
            items: this.$store.state.friends,
            user: this.$store.state.user,
            chat: {}
        };
    },
    watch: {
        search(val) {
            const list = this.list
            if (val) {
                let arr = []
                list.forEach(item => {
                    if (item.members.length) {
                        let addItem = JSON.parse(JSON.stringify(item))
                        addItem.members = item.members.filter(sub => sub.groupNickName.includes(val))
                        arr.push(addItem)
                    }
                })
                this.items = arr
            } else {
                this.items = list
            }
        }
    },
    filters: {
        dateFormat(val) {
            return moment(val).calendar();
        }
    },
    created() {
        this.$socket.listGuests(this.user.operId, res => {
            if (res.response.success) {
                this.friends = res.response.data
            }
        })
    },
    methods: {
        showUser: function (m) {
            this.member = m
            this.$store.commit('setChat', m);
            this.$store.commit('setChatType', 0);
        }
    }
};
</script>

<style lang="scss">
@import '../../../../../static/styles/theme';

.user-box-wrap {
    width: 22rem;
    height: 100%;
    display: flex;
    flex-direction: row;

    .my-num {
        position: absolute;
        right: 16px;
        color: #959595;
    }

    .ivu-collapse-content-box {
        padding-bottom: 0 !important;
    }

    .user-box-list {
        background: #fdfdfd;
        height: 100%;
        width: 22rem;
        display: flex;
        flex-direction: column;

        .group-box {
            overflow: auto;
            flex: 1;
        }
    }

    .group-head {
        span {
            margin-left: -10px;
        }
    }

    .chat-box {
        flex: 1;
        background-color: $color-box-bg;
        display: flex;
        flex-direction: column;
        position: relative;

        .user-box-view {
            position: absolute;
            width: 100%;
            top: 40px;
            padding: 100px;
        }
    }

    .ivu-tabs-content {
        height: 100%;
    }

    .member-img {
        width: 44px;
        height: 44px;
    }

    .search {
        margin: 30px 20px;
        width: calc(100% - 40px);
    }

    .con-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        cursor: pointer;

        span {
            margin-left: 10px;
        }
    }

    .ivu-collapse-simple {
        background-color: #fdfdfd;
        border: none;

        * {
            border: none;
        }
    }

    .ivu-collapse-item {
        border-top: none !important;
        border: none;
    }

    .ivu-collapse-content {
        background-color: #fdfdfd;
        padding: 0 !important;
    }

    .ivu-collapse-header {
        border-bottom: none !important;
    }

    .group-wrap {
        .con-item {
            padding: 8px 16px;
        }

        .con-item:hover {
            background: #eee;
        }

        .con-item:last-child {
            margin-bottom: 0;
        }
    }

}
</style>
