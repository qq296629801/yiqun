<template>
<el-drawer :wrapperClosable="false" :title="addFormMenu.title" :visible.sync="addFormMenu.show">
    <el-form ref="ruleMenuForm" :model="addFormMenu.form" :rules="rulesMenu" label-width="100px">
        <el-form-item label="菜单名称" prop="menuName">
            <el-input clearable placeholder="请输入菜单名称" v-model="addFormMenu.form.menuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL" prop="path">
            <el-input clearable placeholder="请输入菜单URL" v-model="addFormMenu.form.path"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="component">
            <el-input clearable placeholder="请输入组件名称" v-model="addFormMenu.form.component"></el-input>
        </el-form-item>
        <el-form-item label="相关权限">
            <el-input clearable placeholder="请输入相关权限" v-model="addFormMenu.form.perms"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标">
            <el-input placeholder="请设置菜单图标" v-model="addFormMenu.form.icon">
                <i @click="showIcon" slot="suffix" class="el-input__icon el-icon-setting"></i>
            </el-input>
        </el-form-item>
        <el-form-item label="菜单排序">
            <el-input clearable placeholder="请输入菜单排序" v-model="addFormMenu.form.orderNum"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
            <el-tree
                class="scroll-bar tree-box"
                ref="menuTreeMenu"
                :check-strictly="true"
                :props="labelProp"
                :data="addFormMenu.treeDataNoBtn"
                node-key="id"
                show-checkbox
                @check-change="nodeClick">
            </el-tree>
        </el-form-item>
    </el-form>
    <div class="drawer__footer">
        <el-button @click="addFormMenu.show=false">取 消</el-button>
        <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
    </div>
    <icons v-if="showIco.show" :showIco="showIco" @select="handleSelectIcon"></icons>
</el-drawer>
</template>

<script>
import Icons from './Icons'
export default {
    name: 'MenuDrawer',
    props: {
        addFormMenu: {
            type: Object,
            required: true
        }
    },
    components: {
        Icons
    },
    data () {
        return {
            showIco: {
                show: false,
                title: null,
                value: null
            },
            labelProp: {
                label: 'title'
            },
            rulesMenu: {
                menuName: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '请输入菜单URL', trigger: 'blur' }
                ],
                component: [
                    { required: true, message: '请输入组件名称', trigger: 'blur' }
                ]
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.$refs.menuTreeMenu.setCheckedKeys([this.addFormMenu.form.parentId])
        })
    },
    methods: {
        showIcon () {
            this.showIco = {
                show: true,
                title: '图标库',
                value: this.addFormMenu.form.icon
            }
        },
        handleSave () {
            this.$refs['ruleMenuForm'].validate((valid) => {
                if (valid) {
                    if (!this.$refs.menuTreeMenu.getCheckedKeys().length) {
                        this.addFormMenu.form.parentId = '0'
                    }
                    this.$emit('save')
                } else {
                    return false
                }
            })
        },
        handleSelectIcon () {
            this.$set(this.addFormMenu.form, 'icon', this.showIco.value)
            this.showIco.show = false
        },
        nodeClick (data, checked) {
            if (checked) {
                this.addFormMenu.form.parentId = data.id
                this.$refs.menuTreeMenu.setCheckedKeys([data.id])
            }
        }
    }
}
</script>

<style lang="less">
 .el-input__suffix {
     cursor: pointer;
 }
</style>
