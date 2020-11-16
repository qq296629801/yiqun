<template>
<div class="login">
    <div class="login-imgs">
        <div class="flex-v-h-center">
            <img class="lbt-diceng-img" :src="require(`@/assets/img/login1.png`)" alt="">
            <div class="lbt-position-control">
                <div class="lbt-3d">
                    <img v-for="(item, key) in lbt3dCards" :key="key" :style="`transform: rotateY(${30 * key}deg) translateZ(150px); opacity: ${item};`" :src="require(`@/assets/img/login-card${key + 1}.png`)" alt="">
                </div>
            </div>
        </div>
    </div>
    <el-card>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item>
                <div class="head-title">后台管理系统<span class="head-title-English">Background Management System</span></div>
            </el-form-item>
            <el-form-item prop="username">
                <el-input type="text" clearable v-model="ruleForm.username">
                    <span slot="prefix">账号</span>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" clearable v-model="ruleForm.password">
                    <span slot="prefix">密码</span>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm" v-preventReClick="2000">登 录</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</div>
</template>

<script>
export default {
    name: 'login',
    data () {
        const isActiveOut = localStorage.getItem('isActiveOut')
        return {
            isActiveOut,
            ruleForm: {
                username: null,
                password: null
            },
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
            },
            timer: null,
            lbt3dCards: [1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85],
            opacityControl: [false, false, false, false, false, false, true, true, true, true, true, true]
        }
    },
    created () {
        if (+this.isActiveOut === 1) {
            localStorage.setItem('isActiveOut', 0)
            this.$router.go(0)
        }
        this.handleEnter(true)
    },
    mounted () {
        let result = 0 // 整体旋转角度
        let img = document.getElementsByClassName('lbt-3d')[0] // 整体画布
        let imgs = img.getElementsByTagName('img') // 小卡片
        let step = 0.005 // 透明度变化速度
        this.timer = setInterval(() => {
            img.style = `transform: perspective(900px) rotateX(-30deg) rotateY(${result += 1}deg);`
            for (let i = 0, l = this.opacityControl.length; i < l; i++) {
                if (this.opacityControl[i]) {
                    imgs[i].style.opacity = +imgs[i].style.opacity + step
                } else {
                    imgs[i].style.opacity = +imgs[i].style.opacity - step
                }
                if (imgs[i].style.opacity >= 1) {
                    this.opacityControl[i] = false
                } else if (imgs[i].style.opacity <= 0.1) {
                    this.opacityControl[i] = true
                }
            }
        }, 50)
    },
    destroyed () {
        this.handleEnter(false)
        clearInterval(this.timer)
    },
    methods: {
        handleEnter (flag) {
            document.onkeydown = e => {
                if (window.event.keyCode === 13) {
                    if (flag) {
                        this.submitForm()
                    }
                }
            }
        },
        submitForm () {
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.$formData('/login', this.ruleForm).then(res => {
                        if (res) {
                            this.$message.success('登录成功')
                            localStorage.setItem('USER_TOKEN', JSON.stringify(res.token))
                            localStorage.setItem('PERMISSIONS', JSON.stringify(res.permissions))
                            localStorage.setItem('ROLES', JSON.stringify(res.roles))
                            localStorage.setItem('USER', JSON.stringify(res.user))
                            const redirect = window.location.href.split('?redirect=')[1]
                            if (redirect) {
                                window.location.href = decodeURIComponent(redirect)
                            } else {
                                this.$router.push('/monitor/onlineUser')
                            }
                        }
                    })
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="less">
.login {
    input:-webkit-autofill {
        font-size: 13px;
        -webkit-text-fill-color: #fff !important;
        background-color:transparent;
        transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
    }
    position: absolute;
    overflow: auto;
    overflow-y: hidden;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 1024px;
    height: 100%;
    background: -webkit-gradient(linear, left top, right top, from(#00253B), to(#001A2E));
    display: flex;
    .lbt-position-control {
        position: absolute;
        top: 180px;
        left: calc(50% - 20px);
        .lbt-3d {
            width: 40px;
            height: 53px;
            transform-style: preserve-3d;
            img {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 3px;
            }
        }
    }
    .login-imgs {
        width: 60%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: url(../../assets/img/login2.png) center no-repeat;
        background-size: 100%;
        & > div {
            position: relative;
            transform: translateY(-20px);
        }
        .lbt-diceng-img {
            width: 650px;
            height: 575px;
        }
    }
    .el-card {
        z-index: 2;
        background: none;
        box-shadow: 0 0 0 0;
        border: 0;
        height: 100%;
        font-family: 'PingFangSC-Regular';
        display: flex;
        align-items: center;
        .el-card__body {
            .el-form {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                .el-form-item {
                    width: 100%;
                    .head-title {
                        width: 100%;
                        color: #ffffff;
                        font-size: 40px;
                        letter-spacing: 15px;
                        text-align: center;
                        margin-bottom: 40px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        .head-title-English {
                            margin-top: 10px;
                            font-size: 20px;
                            letter-spacing: 1px;
                        }
                    }
                    .el-input {
                        width: 100% !important;
                        .el-input__prefix {
                            color: #fff;
                            left: 0 !important;
                            letter-spacing: 2px;
                            &:after {
                                content: ':'
                            }
                        }
                        .el-input__inner {
                            border: 0;
                            border-bottom: 1px solid #fff;
                            border-radius: 0;
                            margin-bottom: 14px;
                            color: #fff;
                            padding: 0 42px;
                            background: transparent !important;
                        }
                    }
                    .el-button {
                        border-radius: 20px;
                        background: -webkit-gradient(linear, left top, right top, from(#1EDBFF), to(#0DB5FF));
                        letter-spacing: 5px;
                        width: 100%;
                        border: 0;
                        margin-top: 45px;
                        padding: 11px 0;
                        span {
                            font-size: 16px;
                        }
                    }
                    input.el-input__inner {
                        background: none;
                    }
                }
            }
        }
    }
}
</style>
