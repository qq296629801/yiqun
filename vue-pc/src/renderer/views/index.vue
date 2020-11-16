<template>
<div class="v-im">
    <div class="left-bar" style="-webkit-app-region: drag">
        <Modal closable class="user-model" v-model="$store.state.modalMine" footer-hide :title="user.nickName" width="400">
            <p class="user-model-img">
                <img :src="`${$url}/${ user.avatar || user.imgUrl }`" width="60" />
            </p>
            <p class="user-model-item">
                <label>姓名</label>
                <span>{{user.nickName}}</span>
            </p>
            <p class="user-model-item">
                <label>积分：</label>
                <span>{{user.money}}</span>
            </p>
            <p class="user-model-item">
                <Button style="margin-top:10px;" @click="modalPassEdit = true; $store.state.modalMine = false" long>修改密码</Button>
                <Button style="margin-top:10px;" type="error" long @click="myLogout">退出</Button>
            </p>
        </Modal>
        <ul>
            <li class="userPhoto" @click="$store.state.modalMine = true">
                <img :src="`${$url}/${ user.avatar || user.imgUrl }`" />
            </li>
            <li>
                <router-link v-bind:to="'/index/chatBox'">
                    <Icon type="ios-text-outline" />
                </router-link>
            </li>
            <li>
                <router-link v-bind:to="'/index/userBox'">
                    <Icon type="ios-contact-outline" />
                </router-link>
            </li>
            <li>
                <router-link v-bind:to="'/index/chatGroupBox'">
                    <Icon type="ios-contacts-outline" />
                </router-link>
            </li>
        </ul>
        <ul style="position: absolute; bottom: 0px;">
            <li @click="winControl.openSettingWindow()">
                <Icon type="ios-settings-outline" />
            </li>
        </ul>
    </div>
    <keep-alive>
        <router-view class="content" />
    </keep-alive>

    <Modal v-model="modalPassEdit" title="修改密码" width="350">
        <Form :label-width="80" ref="fixPwd" :model="updateFrom" :rules="rules">
            <FormItem label="旧密码" prop="oldPassWord">
                <Input clearable type="password" v-model="updateFrom.oldPassWord" placeholder="请输入旧密码" style="width: 200px" />
            </FormItem>
            <FormItem label="新密码" prop="newPassWord">
                <Input clearable type="password" v-model="updateFrom.newPassWord" placeholder="请输入新密码" style="width: 200px" />
            </FormItem>
            <FormItem label="确认密码" prop="qurePassWord">
                <Input clearable type="password" v-model="updateFrom.qurePassWord" placeholder="请重复输入新密码" style="width: 200px" />
            </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancelUpdatePassWord">取消</Button>
            <Button type="primary" @click="updatePassWord">确定</Button>
        </div>
    </Modal>

</div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
            user: this.$store.state.user,
            token: window.sessionStorage.getItem('token'),
            modalPassEdit: false,
            updateFrom: {
                oldPassWord: '',
                newPassWord: '',
                qurePassWord: '',
            },
            rules: {
                oldPassWord: [{
                    required: true,
                    message: '请输入旧密码',
                    trigger: 'blur'
                }],
                newPassWord: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                }],
                qurePassWord: [{
                    required: true,
                    message: '请重复输入新密码',
                    trigger: 'blur'
                }]
            }
        };
    },
    methods: {
        updatePassWord() {
            this.$refs.fixPwd.validate((valid) => {
                if (valid) {
                    if (this.updateFrom.newPassWord !== this.updateFrom.qurePassWord) {
                        this.$Message.error('密码不一致');
                        return
                    }
                    this.$socket.updatePassword(this.user.id, this.user.userName, this.updateFrom.newPassWord, res => {
                        if (res.success) {
                            this.$store.state.modalMine = true
                            this.$Message.success('修改成功');
                        }
                    })
                }
            })
        },
        cancelUpdatePassWord() {
            this.$store.state.modalMine = true
            this.modalPassEdit = false
            this.updateFrom.oldPassWord = ''
            this.updateFrom.newPassWord = ''
            this.updateFrom.qurePassWord = ''
        },
        myLogout() {
            let self = this
            self.$store.state.modalMine = false
            window.sessionStorage.clear()
            // window.sessionStorage.setItem('login', null)
            // window.sessionStorage.setItem('token', null)
            localStorage.clear();
            // localStorage.removeItem('chatList')
            // localStorage.removeItem('groupChatItem')
            // localStorage.removeItem('friendChatItem')
            // localStorage.removeItem('groupList')
            // localStorage.removeItem('userItem')
            // localStorage.removeItem('user')
            // 跳转到index 页面
            self.$router.push({
                path: '/',
                params: {}
            });
        }
    }
};
</script>

<style lang="scss">
@import '../../../static/styles/theme.scss';
@import '../../../static/styles/v-im.scss';

.v-im {
    display: flex;
    flex-direction: row;

    .left-bar {
        background-color: #2d2d2d;
        width: 6rem;
        height: 100%;

        ul {
            margin: 3rem 1.2rem 1.2rem 1.2rem;
            list-style: none;

            li {
                -webkit-app-region: no-drag;
                display: block;
                width: 3.6rem;
                height: 3.6rem;
                text-align: center;
                margin-bottom: 2rem;
                cursor: pointer;

                .ivu-icon {
                    font-size: 3rem !important;
                    color: $color-default;
                    margin: 0.3rem;
                    cursor: pointer;

                    &:hover {
                        color: $color-write;
                    }
                }

                .router-link-active {
                    .ivu-icon {
                        color: $color-write;
                    }
                }
            }

            .userPhoto {
                margin-bottom: 2rem;

                img {
                    width: 3.6rem;
                    height: 3.6rem;
                }
            }
        }
    }

    .content {
        flex: 1;
    }
}
</style>
