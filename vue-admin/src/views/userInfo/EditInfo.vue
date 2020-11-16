<template>
<el-dialog class="edit-user-info" :append-to-body="true" :title="editInfo.title" :visible.sync="editInfo.show" width="500px" :close-on-click-modal="false">
    <el-form ref="editInfo" :model="editInfo.form" :rules="rules" label-width="100px" @submit.native.prevent>
        <el-form-item label="真实姓名" prop="realname">
            <el-input clearable placeholder="请输入真实姓名" v-model="editInfo.form.realname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input clearable placeholder="请输入邮箱" v-model="editInfo.form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input clearable placeholder="请输入手机号" v-model="editInfo.form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
            <el-select clearable v-model="editInfo.form.deptId" placeholder="请选择部门">
                <el-option v-for="(item, i) in editInfo.deps" :key="i" :label="item.title" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="ssex-item" label="性别" prop="ssex">
            <el-radio-group v-model="editInfo.form.ssex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
                <el-radio label="2">保密</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editInfo.show=false">取 消</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'AddSource',
    props: {
        editInfo: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            rules: {
                realname: [{
                    required: true,
                    message: '请输入真实姓名',
                    trigger: 'blur'
                }],
                deptId: [{
                    required: true,
                    message: '请选择部门',
                    trigger: 'change'
                }],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '只允许英文字母、数字、下划线、英文句号、以及中划线组成' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1(3|4|5|7|8)\d{9}$/, message: '手机号码格式有误，请重新输入' }
                ],
                ssex: [{
                    required: true,
                    message: '请选择性别',
                    trigger: 'change'
                }]
            }
        }
    },
    methods: {
        handleSave () {
            this.$refs['editInfo'].validate((valid) => {
                if (valid) {
                    this.$emit('save')
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="less">
.edit-user-info {
    .el-input {
        width: 320px !important;
    }
    .ssex-item {
        display: flex;
        align-items: center;
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }
}
</style>
