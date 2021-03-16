<template>
<div class="user-info">
    <div class="user-info-top">
        <span class="user-info-con">
            <div class="user-name">{{user.realname}}</div>
            <div>
                <span class="count-title">积分：</span>
                <span class="count-money">{{user.money}}</span>
            </div>
        </span>
        <Avatar shape="square" size="large" :src="`${$url}/${ user.avatar || user.imgUrl }`" />
    </div>
    <Divider />
    <div class="user-info-bot">
        <i-button type="primary" shape="circle" size="large" @click="showChat">发送消息</i-button>
    </div>
</div>
</template>

<script>
export default {
    name: 'userInfo',
    props: ['user'],
    data() {
        return {
            host: ''
        };
    },
    methods: {
        // 打开一个聊天对话框
        showChat() {
            let self = this;
            this.$store.commit('setChat', self.user);
            this.$store.commit('setChatType', 0);
            self.$router.push({
                path: '/index/chatBox',
                params: {}
            });
        },
    }

};
</script>

<style lang="scss">
.user-info {
    font-size: 16px;
    line-height: 200%;
    color: #666;

    .user-info-top {
        display: flex;
        justify-content: space-between;
        .user-name {
            color: #171717;
            font-size: 20px;
        }
        .count-title {
            font-size: 14px;
            color: #666;
        }
        .count-money {
            color: #999;
            font-size: 12px;
        }
    }
    .user-info-bot {
        text-align: center;
    }
}
</style>
