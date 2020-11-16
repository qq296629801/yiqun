<template>
<el-dialog :append-to-body="true" :close-on-click-modal="false" class="add-dialog add-dialog-project" :title="addForm.title" :visible.sync="addForm.show" width="500px">
    <el-form ref="ruleForm" :model="addForm.form" :rules="rules" label-width="100px">
        <el-form-item label="title" prop="title">
            <el-input clearable placeholder="请输入title" v-model="addForm.form.title"></el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
            <el-input clearable placeholder="请输入icon" v-model="addForm.form.icon"></el-input>
        </el-form-item>
        <el-form-item label="color" prop="color">
            <el-input clearable placeholder="请输入color" v-model="addForm.form.color"></el-input>
        </el-form-item>
        <el-form-item label="url" prop="url">
            <el-input clearable placeholder="请输入地址" v-model="addForm.form.url"></el-input>
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
                title: [
                    {
                        required: true,
                        message: '请输入title',
                        trigger: 'blur'
                    }
                ],
                icon: [
                    {
                        required: true,
                        message: '请输入icon',
                        trigger: 'blur'
                    }
                ],
                color: [
                    {
                        required: true,
                        message: '请输入color',
                        trigger: 'blur'
                    }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入url',
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
