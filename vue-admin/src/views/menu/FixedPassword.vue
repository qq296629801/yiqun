<template>
<el-dialog :append-to-body="true" :close-on-click-modal="false" class="add-dialog" :title="passInfo.title" :visible.sync="passInfo.show" width="500px">
    <el-form ref="ruleForm" :model="passInfo.form" :rules="rules" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
            <el-input type="password" clearable placeholder="请输入旧密码" v-model="passInfo.form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" clearable placeholder="请输入新密码" v-model="passInfo.form.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="再次确认" prop="confirmPassword">
            <el-input type="password" clearable placeholder="请再次输入新密码" v-model="passInfo.form.confirmPassword"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="passInfo.show=false">取 消</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'FixedPassword',
    props: {
        passInfo: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            rules: {
                oldPassword: [ { required: true, message: '请输入旧密码', trigger: 'blur' } ],
                newPassword: [ { required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码强度不够，请重新输入', trigger: 'blur' } ],
                confirmPassword: [ { required: true, message: '请再次输入新密码', trigger: 'blur' } ]
            }
        }
    },
    methods: {
        handleSave () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    const { newPassword, confirmPassword } = this.passInfo.form
                    if (newPassword === confirmPassword) {
                        this.$emit('save')
                    } else {
                        this.$message.error('两次密码输入不一致，请重新输入')
                    }
                } else {
                    return false
                }
            })
        }
    }
}
</script>
