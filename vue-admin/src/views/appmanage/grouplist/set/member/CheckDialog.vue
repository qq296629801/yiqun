<template>
<el-dialog class="member-check-dialog" :append-to-body="true" :close-on-click-modal="false" title="用户信息" :visible.sync="checkForm.show">
    <img class="avatar" :src="`${$location.origin}/${checkForm.form.avatar}`" alt="">
    <el-form>
        <el-form-item><i class="iconfont icon-gerenzhongxin"></i>用户名：{{checkForm.form.username}}</el-form-item>
        <el-form-item><i class="iconfont icon-zhenshixingming"></i>真实姓名：{{checkForm.form.realname}}</el-form-item>
        <el-form-item><i class="iconfont icon-xingbie"></i>性别：{{checkForm.form.ssex==='0'?'男':checkForm.form.ssex==='1'?'女':'保密'}}</el-form-item>
        <el-form-item><i class="iconfont icon-dianhua"></i>电话：{{checkForm.form.mobile || '暂无电话信息'}}</el-form-item>
        <el-form-item><i class="iconfont icon-youxiang"></i>邮箱：{{checkForm.form.email || '暂无邮箱信息'}}</el-form-item>
    </el-form>
    <el-form>
        <el-form-item><i class="iconfont icon-jiaose"></i>角色：{{checkForm.form.roleName}}</el-form-item>
        <el-form-item><i class="iconfont icon-bumen"></i>部门：{{checkForm.form.deptName || '暂无部门信息'}}</el-form-item>
        <el-form-item><i class="iconfont icon-chuangjianshijian1"></i>创建时间：{{checkForm.form.createTime}}</el-form-item>
        <el-form-item><i class="iconfont icon-jiarushijian"></i>加入时间：{{checkForm.form.lastLoginTime}}</el-form-item>
    </el-form>
</el-dialog>
</template>
<script>
export default {
    name: 'CheckDialog',
    props: {
        checkForm: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            avatar: '20180414165936.jpg'
        }
    }
}
</script>

<style lang="less">
.member-check-dialog {
    .el-dialog__header {
        border-bottom: 1px solid rgba(0, 0, 0, .2)
    }
    .el-dialog__body {
        display: flex;
    }
    .avatar {
        border-radius: 2px;
        width: 130px;
        height: 130px;
        border: none;
        margin-right: 20px;
    }
    .el-form {
        width: 40%;
        i {
            margin-right: 10px;
        }
    }
}
</style>
