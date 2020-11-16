<template>
<el-dialog :append-to-body="true" :close-on-click-modal="false" class="add-dialog add-dialog-project" :title="addForm.title" :visible.sync="addForm.show" width="500px">
    <el-form ref="ruleForm" :model="addForm.form" :rules="rules" label-width="100px">
        <el-form-item label="群名称" prop="groupName">
            <el-input clearable placeholder="请输入群名称" v-model="addForm.form.groupName"></el-input>
        </el-form-item>
        <el-form-item label="群头像" class="addGroupAvatar" prop="avatar">
            <img v-if="addForm.form.avatar" :src="`${$location.origin}/${addForm.form.avatar}`" class="qunzhutx">
            <div :style="addForm.form.avatar?'left:186px':''" class="upload-warp"><span class="upload-btn">上传</span><input style="opacity: 0;" type="file" accept="image/*" @change="handleSelectTx"/></div>
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
                groupName: [
                    {
                        required: true,
                        message: '请输入群名称',
                        trigger: 'blur'
                    }
                ],
                avatar: [
                    {
                        required: true,
                        message: '请添加群头像',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        handleSelectTx (e) {
            // 上传之前可以过滤掉其他类型，很简单，加类型 accept="image/*"
            this.file = e.target.files[0]
            // this.waitSubmitAvatar = e.target.files[0].name 此时是客户机的地址，不用直接获取
            let formData = new FormData()
            formData.append('file', this.file)
            // file 是服务器的入参，这个接口只有一个入参就是文件类型
            this.$post('/file/upload', formData).then(res => {
                // 返回的是服务器后台的处理过的地址，dsadxzdasd.jpg ，因为客户上传文件名称可能是中文加乱码，所以服务器要处理。
                console.log(res)
                this.addForm.form.avatar = res
                //  复制给全局变量
            })
        },
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
