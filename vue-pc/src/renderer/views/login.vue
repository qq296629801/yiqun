<template>
<div class="login">
    <Top></Top>
    <div class="login-panel" style="-webkit-app-region: no-drag">
        <Alert v-if="showErr" type="error">{{err}}</Alert>
        <div v-show="!showRegister" class="login-form">
            <div class="login-form-left">
                <img class="my-logo" src="../assets/ll.png" alt="">
            </div>
            <div class="login-form-right">
                <div class="title">账号秘密登录</div>
                <div class="item">
                    <Input clearable prefix="ios-contact-outline" v-model="telephone" placeholder="手机" class="item-input" />
                </div>
                <div class="item">
                    <Input clearable prefix="ios-lock-outline" type="password" v-model="password" placeholder="密码" class="item-input" />
                </div>
                <div class="btn item">
                    <Button type="primary" @click="login()" icon="md-contact">登录</Button>
                </div>
                <div class="item register">
                    <a type="info" class="pull-right" @click="showRegister = true">
                        <Icon type="ios-cloud-circle" />注册
                    </a>
                </div>
            </div>
        </div>
    </div>

    <Modal :transfer="false" closable class="user-model" v-model="showRegister" footer-hide title="注册新用户" width="400">
        <Form ref="formValidate" :model="registerForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="手机" prop="registerPhone">
                <Input clearable class="my-ipt" v-model="registerForm.registerPhone" placeholder="请输入手机号" @on-blur="verifyTelephone"></Input>
            </FormItem>
            <FormItem label="昵称" prop="registerUsername">
                <Input clearable class="my-ipt" v-model="registerForm.registerUsername" placeholder="请输入昵称"></Input>
            </FormItem>
            <FormItem label="密码" prop="registerPassword">
                <Input clearable class="my-ipt" type="password" v-model="registerForm.registerPassword" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="qurePassWord">
                <Input clearable class="my-ipt" type="password" v-model="registerForm.qurePassWord" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="性别" prop="sex">
                <RadioGroup v-model="registerForm.sex">
                    <Radio label="male">男</Radio>
                    <Radio label="female">女</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="出生日期" prop="birthday">
                <DatePicker class="my-ipt" type="date" v-model="registerForm.birthday" placeholder="出生日期"></DatePicker>
            </FormItem>
            <Button type="primary" long @click="saveRegister">保存</Button>
        </Form>
    </Modal>
    <vue-particles color="#dedede" :particlesNumber="50" class="bg-login"></vue-particles>
</div>
</template>

<script>
    import Top from './im/components/top.vue';
    import { initData } from '../utils/dbUtil'
    export default {
    name: 'login',
    data() {
        return {
            ruleValidate: {
                registerPhone: [{
                    required: true,
                    message: '请填写手机号',
                    trigger: 'blur'
                }],
                registerUsername: [{
                    required: true,
                    message: '请填写用户名',
                    trigger: 'blur'
                }],
                registerPassword: [{
                    required: true,
                    message: '请填写密码',
                    trigger: 'blur'
                }],
                qurePassWord: [{
                    required: true,
                    message: '请再次填写密码',
                    trigger: 'blur'
                }],
                sex: [{
                    required: true,
                    message: '请选择性别',
                    trigger: 'change'
                }],
                birthday: [{
                    required: true,
                    type: 'date',
                    message: '请选择出生日期',
                    trigger: 'change'
                }]
            },
            checkCode: null,
            app_name: '',
            telephone: '',
            password: '',
            registerForm: {
                registerPhone: '',
                registerUsername: '',
                registerPassword: '',
                qurePassWord: '',
                sex: '',
                birthday: ''
            },
            err: '',
            showErr: false,
            showSetting: false,
            showRegister: false,
            dialCode: '86',
            host: '182.61.169.91',
            isCanRegister: false,
            ifshow: false,
            isdefultImg: true,
            img: '',
            formData: '',
            formItem: {
                input: '',
                select: '',
                radio: 'male',
                checkbox: [],
                switch: true,
                date: '',
                time: '',
                slider: [20, 50],
                textarea: ''
            }
        };
    },
    components: {
        Top
    },
    mounted(){
        this.$socket.initWebIM(this.$ws, true, true);
    },
    methods: {
        clickUser() {
            location.reload();
        },
        verifyTelephone() {},
        imgChange: function () {
            var file = $('#photoImg')[0].files[0];
            this.formData = new FormData();
            this.formData.append('file', file);
            var URL = window.URL || window.webkitURL;
            var imgURL = URL.createObjectURL(file);
            this.img = imgURL;
            this.isdefultImg = false;
            this.ifshow = true;
        },
        selectImg: function () {
            this.$refs.img.click();
        },
        dataChange() {},
        saveRegister() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                }
            })
        },
        login: function () {
            let self = this;
            this.$socket.login(this.telephone, this.password, this.checkCode, res => {
                if (res.success) {
                    this.$store.commit('setUserData', res.response.data);
                    this.$store.commit('setUser', res.response.data.user);

                    // 缓存消息列表
                    this.$socket.queryOnlineMessage(res.response.data.user.operId,q =>{
                        let data = q.response.data;
                        for(var i in data){
                            initData(data[i].groupMsg.list, data[i].groupInfo.chatId);
                        }
                    })

                    self.$router.push({
                        path: '/index/chatBox',
                        params: {}
                    });
                } else {
                    this.$Message.error(res.reason);
                }
            });
        }
    },
};
</script>

<style lang="scss">
@import '../../../static/styles/theme.scss';

.login {
    height: 100%;
    background: url('../assets/bg.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    .my-ipt {
        width: 100%;
    }

    .login-form {
        display: flex;

        .my-logo {
            width: 7rem;
        }

        .login-form-left {
            margin-top: -1rem;
            padding-left: 30px;
            width: 15rem;
            height: 28rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-form-right {
            width: 35rem;
            height: 28rem;
            padding-right: 54px;
            padding-top: 40px;
        }
    }

    .bg-login {
        height: 100%;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 1;
    }

    .login-panel {
        background: url('../assets/login-bg.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        margin-left: -25rem;
        top: 50%;
        margin-top: -12rem;
        z-index: 2;

        .item {
            margin-top: 12px;
            width: 100%;

            label {
                width: 5rem;
                text-align: right;
                display: inline-block;
                color: #fff;
            }

            .item-input {
                width: 100%;
            }
        }

        .btn {
            button {
                width: 100%;
            }
        }

        .title {
            color: #fff;
            font-size: 14px;
        }
    }

    .setting {
        color: #fff;
        font-size: 2rem;
        display: block;
        right: 1rem;
        position: absolute;
        bottom: 1rem;
        cursor: pointer;
        z-index: 3;
    }

    .save-setting-btn {
        margin: 1rem 0 !important;
    }

    .register {
        padding: 0 2.2rem;

        a {
            color: #ffffff;

            i {
                font-size: 14px;
                letter-spacing: 5px;
            }
        }
    }
}

.setting-item {
    margin-bottom: 1rem;
}

.ivu-modal-wrap {
    .ivu-form-item {
        margin-bottom: 20px;
    }
}
</style>
