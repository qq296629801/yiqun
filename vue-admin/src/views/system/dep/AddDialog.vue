<template>
<el-dialog class="add-dialog" :append-to-body="true" :close-on-click-modal="false" :title="addForm.title" :visible.sync="addForm.show" width="500px">
    <el-form ref="ruleForm" :model="addForm.form" :rules="rules" label-width="100px">
        <el-form-item label="部门名称" prop="deptName">
            <el-input clearable placeholder="请输入部门名称" v-model="addForm.form.deptName"></el-input>
        </el-form-item>
        <el-form-item label="上级部门">
            <el-tree
                class="scroll-bar tree-box dep-tree"
                ref="deptTree"
                node-key="id"
                :check-strictly="true"
                :props="labelProp"
                :data="addForm.treeData"
                show-checkbox
                @check-change="nodeClick">
            </el-tree>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addForm.show=false">取 消</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
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
            labelProp: {
                label: 'title'
            },
            rules: {
                deptName: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' },
                    { max: 20, message: '长度在 20 个字符以内', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        nodeClick (data, checked) {
            if (checked) {
                this.addForm.form.parentId = data.id
                this.$refs.deptTree.setCheckedKeys([data.id])
            }
        },
        handleSave () {
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if (!this.$refs.deptTree.getCheckedKeys().length) {
                        this.addForm.form.parentId = '0'
                    }
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
.dep-tree {
    height: 40vh;
}
</style>
