<template>
    <div>
        <el-card class="user-info" shadow="hover">
            <div slot="header" class="clearfix">
                <span>个人中心</span>
                <el-button class="btn" type="text" @click="handleEditInfo">编辑资料</el-button>
            </div>
            <div class="user-info-con">
                <div class="user-box-left">
                    <img v-if="avatar" class="user-avatar" :src="`${$location.origin}/${avatar}`" alt="">
                    <el-button class="edit-avatar-btn" icon="el-icon-edit" @click="avatarInfo.show=true">修改头像</el-button>
                </div>
                <el-form>
                    <el-form-item label="真实姓名：">{{user.realname}}</el-form-item>
                    <el-form-item label="角色：">{{user.roleName || '暂无角色'}}</el-form-item>
                    <el-form-item label="性别：">{{sex()}}</el-form-item>
                    <el-form-item label="电话：">{{user.mobile || '暂未绑定电话'}}</el-form-item>
                    <el-form-item label="邮箱：">{{user.email || '暂未绑定邮箱'}}</el-form-item>
                    <el-form-item label="部门：">{{user.deptName || '暂无部门'}}</el-form-item>
                </el-form>
            </div>
        </el-card>
        <edit-info v-if="editInfo.show" :editInfo="editInfo" @save="handleSaveUser"></edit-info>
        <edit-avatar v-if="avatarInfo.show" :avatarInfo="avatarInfo" @save="handleSaveAvatar"></edit-avatar>
    </div>
</template>
<script>
import EditInfo from './EditInfo'
import EditAvatar from './EditAvatar'
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'UserInfo',
    components: { EditInfo, EditAvatar },
    computed: {
        ...mapGetters({
            avatar: 'common/getAvatar'
        })
    },
    data () {
        return {
            username: JSON.parse(localStorage.getItem('USER')).username,
            user: {
                avatar: null,
                realname: null,
                roleName: null,
                ssex: null,
                mobile: null,
                email: null,
                deptName: null,
                deptId: ''
            },
            avatarInfo: {
                show: false,
                title: '选择头像',
                avatar: null
            },
            editInfo: {
                show: false,
                title: '编辑资料',
                deps: [],
                form: {
                    realname: null,
                    email: null,
                    mobile: null,
                    ssex: null,
                    userId: '',
                    deptId: null,
                    roleId: null,
                    status: null,
                    username: null
                }
            }
        }
    },
    created () {
        this.init()
        this.getDeps()
    },
    methods: {
        ...mapMutations({
            setAvatar: 'common/setAvatar'
        }),
        handleSaveAvatar () {
            const params = {
                username: this.username,
                avatar: this.avatarInfo.avatar
            }
            this.$put('/user/avatar', params).then(res => {
                if (res) {
                    this.$message.success('修改头像成功')
                    this.avatarInfo.show = false
                    this.init()
                }
            })
        },
        handleEditInfo () {
            this.editInfo.show = true
            this.editInfo.form = {
                realname: this.user.realname,
                email: this.user.email,
                mobile: this.user.mobile,
                ssex: this.user.ssex,
                userId: this.user.userId,
                deptId: this.user.deptId ? this.user.deptId.toString() : this.user.deptId,
                roleId: this.user.roleId,
                status: this.user.status,
                username: this.user.username
            }
        },
        handleSaveUser () {
            this.$put('/user/profile', this.editInfo.form).then(res => {
                if (res) {
                    this.$message.success('保存成功')
                    this.editInfo.show = false
                    this.init()
                }
            })
        },
        getDeps () {
            this.$get('/dept').then(res => {
                if (res) {
                    this.editInfo.deps = res.rows.children
                }
            })
        },
        init () {
            this.$get(`/user/${this.username}`).then(res => {
                if (res) {
                    localStorage.setItem('USER', JSON.stringify(res))
                    this.user = res
                    this.avatarInfo.avatar = res.avatar
                    this.setAvatar(res.avatar)
                }
            })
        },
        sex () {
            switch (this.user.ssex) {
                case '0':
                    return '男'
                case '1':
                    return '女'
                case '2':
                    return '保密'
                default:
                    return this.user.ssex
            }
        }
    }
}
</script>
<style lang="less">
    .user-info {
        .btn {
            float: right;
            padding: 3px 0;
            font-size: 14px;
        }
        .edit-avatar-btn {
            margin-top: 16px;
        }
        .user-avatar {
            width: 160px;
            height: 160px;
            border: none;
            border-radius: 2px;
        }
        .user-info-con {
            display: flex;
            .user-box-left {
                width: 30%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
        }
    }
</style>
