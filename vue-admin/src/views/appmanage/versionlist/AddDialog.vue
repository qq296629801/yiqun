<template>
<el-dialog :append-to-body="true" :close-on-click-modal="false" class="add-dialog add-dialog-project" :title="addForm.title" :visible.sync="addForm.show" width="500px">
    <el-form ref="ruleForm" :model="addForm.form" :rules="rules" label-width="100px">
        <el-form-item label="ios" prop="ios">
            <el-input clearable placeholder="请输入ios版地址" v-model="addForm.form.ios"></el-input>
        </el-form-item>
        <el-form-item label="android" prop="android">
            <el-input clearable placeholder="请输入android版地址" v-model="addForm.form.android"></el-input>
        </el-form-item>
        <el-form-item label="remark">
            <el-input clearable placeholder="请输入remark" v-model="addForm.form.remark"></el-input>
        </el-form-item>
        <el-form-item label="pc" prop="pc">
            <el-input clearable placeholder="请输入pc版地址" v-model="addForm.form.pc"></el-input>
        </el-form-item>
        <el-form-item label="version" prop="version">
            <el-input clearable placeholder="请输入version" v-model="addForm.form.version"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addForm.show=false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'AddDialog',
    props: {
        addForm: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            file: '',
            rules: {
                ios: [
                    {
                        required: true,
                        message: '请输入ios版地址',
                        trigger: 'blur'
                    }
                ],
                android: [
                    {
                        required: true,
                        message: '请输入android版地址',
                        trigger: 'blur'
                    }
                ],
                pc: [
                    {
                        required: true,
                        message: '请输入pc版地址',
                        trigger: 'blur'
                    }
                ],
                version: [
                    {
                        required: true,
                        message: '请输入version',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        handleSave () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    this.$emit('save')
                } else {
                    return false
                }
            })
        },
        resetForm () {
            this.$refs['ruleForm'].resetFields()
        }
    }
}
</script>

<style lang="less">
.add-dialog-project {
    .el-input {
        width: 300px !important;
    }
    .el-textarea__inner {
        width: 300px !important;
    }
    .addGroupAvatar {
        .upload-warp {
            top: 0;
        }
    }
    .qunzhutx {
        width: 178px;
        height: 178px;
    }
}
</style>
