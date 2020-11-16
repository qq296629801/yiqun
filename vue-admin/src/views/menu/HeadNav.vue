<template>
<div class="header">
    <div class="left">
        后台管理系统
    </div>
    <div class="right" v-if="user">
        <el-dropdown trigger="click">
            <span class="el-dropdown-link"><avatar class="avatar" username="avatar" :src="`${$location.origin}/${user.avatar}`" :size="30"></avatar>{{user.username}}</span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="$router.push('/userInfo')">个人中心</el-dropdown-item>
                <el-dropdown-item @click.native="fixedPassword">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="handleSignout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
    <fixed-password v-if="passInfo.show" :passInfo="passInfo" @save="handleSave"></fixed-password>
</div>
</template>

<script>
import Avatar from 'vue-avatar'
import FixedPassword from './FixedPassword'
import { mapGetters } from 'vuex'
export default {
    name: 'HeadNav',
    components: {
        Avatar,
        FixedPassword
    },
    computed: {
        ...mapGetters({
            menuMode: 'common/getMenuMode',
            avatar: 'common/getAvatar'
        })
    },
    data () {
        return {
            user: JSON.parse(localStorage.getItem('USER')),
            passInfo: {
                show: false,
                title: '修改密码',
                form: {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null
                }
            }
        }
    },
    methods: {
        handleSave () {
            const params = {
                username: this.user.username,
                password: this.passInfo.form.oldPassword
            }
            this.$get('/user/password/check', params).then(res => {
                if (res) {
                    this.confirmSave()
                } else {
                    this.$message.error('旧密码不正确，请从新输入')
                }
            })
        },
        confirmSave () {
            const params = {
                username: this.user.username,
                password: this.passInfo.form.newPassword
            }
            this.$put('/user/password', params).then(res => {
                if (res) {
                    this.$message.success('修改成功，请重新登录')
                    localStorage.clear()
                    this.$router.push('/login')
                }
            })
        },
        fixedPassword () {
            this.passInfo = {
                show: true,
                title: '修改密码',
                form: {
                    oldPassword: null,
                    newPassword: null,
                    confirmPassword: null
                }
            }
        },
        handleSignout () {
            localStorage.clear()
            localStorage.setItem('isActiveOut', 1)
            this.$router.push('/login')
        }
    },
    watch: {
        avatar (val) {
            this.user.avatar = val
        }
    }
}
</script>

<style lang="less">
.header {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;

    .left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 100%;

        .head-title {
            letter-spacing: 1px;
            font-size: 18px;
            color: #333;
            i {
                font-size: 18px;
                color: #333;
            }
        }
        .tag {
            color: #333;
            margin-left: 20px;
            font-size: 14px;
        }
    }

    .right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
        width: 200px;
        float: right;
        .el-dropdown-link {
            cursor: pointer;
            display: flex;
            align-items: center;
            color: #333;
            .avatar {
                margin-right: 5px;
            }
        }
    }
}
</style>
