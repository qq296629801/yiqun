<template>
<el-dialog class="add-dialog" :title="addForm.title" :append-to-body="true" :close-on-click-modal="false" :visible.sync="addForm.show" width="500px">
    <el-form ref="ruleForm" :model="addForm.form" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
            <el-input clearable placeholder="请输入用户名" v-model="addForm.form.username"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
            <el-input clearable placeholder="请输入真实姓名" v-model="addForm.form.realname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="ssex">
            <el-radio v-model="addForm.form.ssex" label="0">男</el-radio>
            <el-radio v-model="addForm.form.ssex" label="1">女</el-radio>
            <el-radio v-model="addForm.form.ssex" label="2">保密</el-radio>
        </el-form-item>
        <el-form-item v-if="addForm.title==='新增用户'" label="密码">
            <el-tooltip class="item" effect="dark" content="新用户默认密码为 123456" placement="top">
                <el-input clearable placeholder="请输入密码" type="password" v-model="password" :readonly="true"></el-input>
            </el-tooltip>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
            <el-select v-model="addForm.form.roleId" multiple placeholder="请选择角色">
                <el-option
                    v-for="(item, key) in roleList"
                    :key="key"
                    :label="item.roleName"
                    :value="item.roleId">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="部门">
            <el-select ref="treeDepSelect" popper-class="deptSelectDown" clearable v-model="addForm.form.deptId" placeholder="请选择部门">
                <el-option
                    :label="deptLabel"
                    :value="addForm.form.deptId">
                    <el-tree
                        class="scroll-bar tree-box"
                        ref="deptTree"
                        node-key="id"
                        :check-strictly="true"
                        :props="labelProp"
                        :data="depList"
                        @node-click="nodeClick">
                    </el-tree>
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-radio v-model="addForm.form.status" label="0">锁定</el-radio>
            <el-radio v-model="addForm.form.status" label="1">有效</el-radio>
            <!-- <el-radio v-model="addForm.form.status" label="2">未分配</el-radio>
            <el-radio v-model="addForm.form.status" label="3">已注销</el-radio> -->
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
        const roles = JSON.parse(localStorage.getItem('ROLES'))
        return {
            roles,
            labelProp: {
                label: 'title'
            },
            deptLabel: '',
            depList: [],
            roleList: [],
            password: '123456',
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 50, message: '有效长度4到50个字符' }
                ],
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' }
                ],
                roleId: [
                    { required: true, message: '请选择角色', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                ssex: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ]
            }
        }
    },
    mounted () {
        this.getDeps()
    },
    methods: {
        getInitDeptLabel (data, deptId) {
            for (let i = 0, l = data.length; i < l; i++) {
                if (data[i].id === deptId) {
                    this.deptLabel = data[i].text
                }
                if (data[i].children) {
                    this.getInitDeptLabel(data[i].children)
                }
            }
        },
        nodeClick (target, node) {
            this.addForm.form.deptId = target.id
            this.deptLabel = target.title
            this.$refs.treeDepSelect.blur()
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
        getDeps () {
            // 获取部门树结构
            this.$get('/dept').then(res => {
                if (res) {
                    this.depList = res.rows.children
                    this.getInitDeptLabel(this.depList, this.addForm.form.deptId)
                }
            })
            // 获取角色列表
            this.$get('/role').then(res => {
                if (res) {
                    if (!this.roles.includes('超级管理员')) {
                        this.roleList = res.rows.filter(v => {
                            return v.roleName === '群员'
                        })
                    } else {
                        this.roleList = res.rows
                    }
                }
            })
        }
    }
}
</script>

<style lang="less">
.add-dialog {
    .el-form-item__content {
        display: -webkit-box;
    }
}
</style>
