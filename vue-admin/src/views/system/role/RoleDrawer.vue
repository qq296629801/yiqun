<template>
<el-drawer class="role-drawer" :wrapperClosable="false" :title="addForm.title" :visible.sync="addForm.show">
    <el-form v-if="addForm.title==='角色信息'" class="roleCheckDialog" label-width="140px">
        <el-form-item label="角色名称：">{{addForm.form.roleName}}</el-form-item>
        <el-form-item label="角色描述：">{{addForm.form.remark}}</el-form-item>
        <el-form-item label="创建时间：">{{addForm.form.createTime}}</el-form-item>
        <el-form-item label="修改时间：">{{addForm.form.modifyTime}}</el-form-item>
        <el-form-item label="所拥有的权限：">
            <div class="scroll-bar tree-box">
                <el-tree ref="roleTree" :filter-node-method="filterNode" :props="labelProp" :data="treeData" node-key="id" default-expand-all></el-tree>
            </div>
        </el-form-item>
    </el-form>
    <el-form v-else ref="form" :model="addForm.form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
            <el-input clearable placeholder="请输入角色名称" v-model="addForm.form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
            <el-input clearable placeholder="请输入角色描述" v-model="addForm.form.remark"></el-input>
        </el-form-item>
        <el-form-item label="权限选择">
            <el-tree
                class="scroll-bar tree-box"
                ref="roleTree"
                :props="labelProp"
                :data="treeData"
                node-key="id"
                show-checkbox
                @check-change="nodeClick">
            </el-tree>
        </el-form-item>
    </el-form>
    <div class="drawer__footer">
      <el-button @click="addForm.show=false">{{addForm.title!=='角色信息'?'取 消':'关 闭'}}</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave" v-if="addForm.title!=='角色信息'">确 定</el-button>
    </div>
</el-drawer>
</template>

<script>
export default {
    name: 'RoleDrawer',
    props: {
        addForm: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            treeData: [],
            labelProp: {
                label: 'title'
            },
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        this.getTreeData()
    },
    methods: {
        filterNode (arr, data) {
            return arr.includes(data.id)
        },
        getRight () {
            this.$nextTick(() => {
                this.$get(`/role/menu/${this.addForm.form.roleId}`).then(res => {
                    if (res) {
                        if (this.addForm.title === '角色信息') {
                            this.$refs.roleTree.filter(res)
                        }
                        this.$refs.roleTree.setCheckedKeys(res)
                    }
                })
            })
        },
        getTreeData () {
            this.$get('/menu').then(res => {
                if (res) {
                    this.treeData = res.rows.children
                    this.getRight()
                }
            })
        },
        handleSave () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$emit('save')
                } else {
                    return false
                }
            })
        },
        nodeClick (data) {
            let halfChecked = this.$refs.roleTree.getHalfCheckedKeys().map(v => +v).join(',') && this.$refs.roleTree.getHalfCheckedKeys().map(v => +v).join(',') + ','
            let checked = this.$refs.roleTree.getCheckedNodes().map(v => v.id).join(',')
            this.addForm.form.menuId = (halfChecked + checked) || '0'
        }
    }
}
</script>

<style lang="less">
.role-drawer {
    .el-form {
        flex-direction: column;
        justify-content: flex-start !important;
    }
    .roleCheckDialog {
        width: 100% !important;
        overflow: auto;
        .el-form-item {
            margin-bottom: 4px !important;
        }
    }
}
</style>
