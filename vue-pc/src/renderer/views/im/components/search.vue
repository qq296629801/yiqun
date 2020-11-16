<template>
<div>
    <Input clearable prefix="ios-search" clearable v-model="search" placeholder="搜索" size="small" class="search" @on-focus="showSearch()" />
    <div class="search-div" v-show="showSearchDiv">
        <div class="search-item">
            <Input clearable prefix="ios-search" clearable v-model="search" @on-clear="closeSearchDiv" placeholder="搜索" size="small" class="search" @on-blur="searchUser" @on-search="searchUser" @on-keyup="searchUser" />
            <!-- <Icon type="ios-close" class="text-right" @click="closeSearchDiv()"></Icon> -->
        </div>
        <div class="group-box">
            <template v-if="type === 3">
                <template v-for="(user, index) in searchList">
                    <ul class="user-list" v-if="user.members.length" :key="index">
                        <li class="user">
                            <a href="javascript:" @click="showChat(user)">
                                <b>{{user.name}}</b>
                                <template v-for="m in user.members">
                                    <img :src="`${$url}/${ m.avatar || user.imgUrl }`" width="60" />
                                    <b>{{m.groupNickName}}</b>
                                </template>
                            </a>
                        </li>
                    </ul>
                </template>
            </template>
            <template v-else>
                <ul class="user-list" v-for="(user, index) in searchList" :key="index">
                    <li class="user">
                        <a href="javascript:" @click="showChat(user)">
                            <template v-if="type==1">
                                <img :src="`${$url}/${ user.avatar || user.imgUrl }`" width="60" />
                                <b>{{ user.chatName }}</b>
                            </template>
                            <template v-if="type==2">
                                <img :src="`${$url}/${ user.avatar || user.imgUrl }`" width="60" />
                                <b>{{ user.remarkName || user.groupNickName || user.chatName }}</b>
                            </template>
                        </a>
                    </li>
                </ul>
            </template>
        </div>
    </div>
</div>
</template>

<script>
import {
    pinyin
} from '../../../utils/Pinyin.js';

export default {
    props: ['items', 'type'],
    components: {},
    data() {
        return {
            search: '',
            searchList: [],
            showSearchDiv: false,
            host: '',
            sourceList: '',
        };
    },
    methods: {
        showSearch: function () {
            this.search = ''
            this.showSearchDiv = true;
            this.searchList = this.items
            this.sourceList = this.items
        },
        searchUser: function () {
            if (!this.search) {
                this.searchList = this.sourceList
                return
            }
            this.items = this.sourceList
            this.searchList = []
            let name = ''
            for (var index in this.items) {
                let item = this.items[index]
                if (this.type == 1) {
                    name = item.chatName;
                } else if (this.type == 2) {
                    name = item.groupNickName;
                } else if (this.type == 3) {
                    let members = item.members;
                    for (var m in members) {
                        name += members[m].groupNickName;
                    }
                }
                let searchTemp = this.search.trim().toUpperCase();
                if (searchTemp) {
                    const str1 = pinyin.getFullChars(name).toUpperCase()
                    const str2 = pinyin.getCamelChars(name)
                    if (name.includes(searchTemp) || str1.includes(searchTemp) || str2.includes(searchTemp)) {
                        item.type = '0';
                        this.searchList.push(item);
                    }
                }
            }
        },
        closeSearchDiv: function () {
            this.search = ''
            this.showSearchDiv = false
            this.searchList = this.sourceList
        },
        showChat: function (user) {
            this.search = ''
            this.showSearchDiv = false
            this.searchList = this.sourceList
            this.$emit('showSearchChat', user)
        }
    },
    created: function () {
        // let self = this;
        // let users = self.$store.state.userFriendList;
        // for (let group of users) {
        //   for (let user of group.userList) {
        //     self.userList.push(user);
        //   }
        // }
    }
};
</script>

<style lang="scss" scoped>
@import '../../../../../static/styles/theme';

.search {
    margin: 0 0 1rem;

    input {
        border-radius: 0;
        border: 0;
    }
}

.search-div {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 6rem;
    height: 100%;
    width: 22rem;
    background-color: $color-light-gray;
    z-index: 999999999999999999;
    // box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

    .search-item {
        margin: 1.5rem 1.5rem 0 1.5rem;

        // i {
        //     color: $color-default;
        //     font-size: 1.4rem;
        //     font-weight: bolder;
        //     float: right;
        //     padding: 0.5rem;
        //     height: 24px;
        //     cursor: pointer;
        // }
    }

    .group-box {
        flex: 1;
        overflow: auto;

        .count {
            color: #aaaaaa;
        }

        li {
            list-style: none;
            position: relative;
            font-size: 1.2rem;
            cursor: pointer;
            font-weight: 200;

            // margin-bottom: 2rem;
            h5 {
                padding: 0.5rem 0;
                cursor: pointer;
                font-size: 1.3rem;
                font-weight: 200;

                i {
                    vertical-align: baseline;
                }
            }

            img {
                width: 4.4rem;
                height: 4.4rem;
                position: absolute;
                top: 0.4rem;
                left: 2rem;
            }

            b {
                position: absolute;
                font-size: 1.3rem;
                left: 7.5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 600;
                top: 1.6rem;
            }

            p {
                position: absolute;
                left: 7.5rem;
                bottom: 0.4rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 75%;
                font-size: 1.1rem;
                color: #aaaaaa;
            }
        }

        .user {
            height: 5.2rem;
            position: relative;

            a {
                display: block;
                width: 100%;
                height: 100%;
                color: $color-default;
                position: relative;

                i {
                    display: inline-block;
                    width: 1.8rem;
                    height: 1.6rem;
                    background-color: #ff0000;
                    border-radius: 50%;
                    color: $color-write;
                    text-align: center;
                    font-style: normal;
                    position: absolute;
                    left: 1rem;
                    top: 0;
                    z-index: 99999999999;
                }
            }

            &:hover {
                background-color: $color-gray !important;

                &>i {
                    color: $color-default;
                    background-color: $color-write;
                }
            }

            .active {
                background-color: $color-gray !important;
            }

            &>i {
                position: absolute;
                right: 1rem;
                bottom: 1.6rem;
                cursor: pointer;
                border-radius: 50%;
                padding: 0.2rem;
                text-align: center;
                color: $color-light-gray;

                &:hover {
                    color: $color-default;
                    background-color: $color-write;
                }
            }
        }
    }
}
</style>
