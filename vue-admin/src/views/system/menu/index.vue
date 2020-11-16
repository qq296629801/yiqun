<template>
<div class="system-menu box-wrap">
    <el-form  class="el-form-between" @submit.native.prevent>
        <el-form-item>
            <el-input
                @keyup.enter.native="handleSearch"
                @clear="handleSearch"
                placeholder="请输入菜单名称"
                clearable
                v-model="queryForm.menuName">
                <i @click="handleSearch" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-dropdown v-hasPermission="'menu:add'" @command="handleCommand">
                <el-button type="primary">
                    新增<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="0">新增菜单</el-dropdown-item>
                    <el-dropdown-item command="1">新增按钮</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button  v-hasPermission="'menu:delete'" @click="handleDel">删除</el-button>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @flash="handleSearch" @addMenu="handleAddMenu" @select="selectTableData" @addBtn="handleAddBtn"></table-list>
    <menu-drawer v-if="addFormMenu.show" :addFormMenu="addFormMenu" @save="handleSaveMenu"></menu-drawer>
    <btn-drawer v-if="addFormBtn.show" :addFormBtn="addFormBtn" @save="handleSaveBtn"></btn-drawer>
</div>
</template>

<script>
import MenuDrawer from './MenuDrawer'
import TableList from './TableList'
import BtnDrawer from './BtnDrawer'
export default {
    name: 'Menu',
    components: {
        MenuDrawer,
        TableList,
        BtnDrawer
    },
    data () {
        return {
            tableData: {
                isSearch: false,
                loading: false,
                rows: []
            },
            addFormMenu: {
                show: false,
                title: '新增菜单',
                treeDataNoBtn: [],
                form: {
                    type: '0'
                }
            },
            addFormBtn: {
                show: false,
                title: '新增按钮',
                treeDataNoBtn: [],
                form: {
                    type: '0'
                }
            },
            queryForm: {
                menuName: null,
                time: ['', '']
            },
            selected: []
        }
    },
    created () {
        this.init()
    },
    methods: {
        selectTableData (val) {
            this.selected = val
        },
        handleDel () {
            if (!this.selected.length) {
                this.$message.info('请选择要删除的菜单')
            } else {
                this.$confirm('确定要删除该菜单吗？', '提示', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(() => {
                    this.handleDelConfirm()
                }).catch(() => {})
            }
        },
        handleDelConfirm () {
            this.$delete('/menu', this.selected.map(v => v.id).join(',')).then(res => {
                if (res) {
                    this.$message.success('删除成功')
                    this.handleSearch()
                }
            })
        },
        handleCommand (val) {
            val === '0' ? this.handleAddMenu(true, '0') : this.handleAddBtn(true, '1')
        },
        handleSaveMenu () {
            let flag = this.addFormMenu.title === '新增菜单'
            this[flag ? '$formDataType2' : '$put']('/menu', this.addFormMenu.form).then(res => {
                if (res) {
                    this.$message.success(flag ? '新增成功' : '修改成功')
                    this.addFormMenu.show = false
                    this.init()
                    // 更新菜单信息
                    this.$getRoutes()
                }
            })
        },
        handleSaveBtn () {
            let flag = this.addFormBtn.title === '新增按钮'
            this[flag ? '$formDataType2' : '$put']('/menu', this.addFormBtn.form).then(res => {
                if (res) {
                    this.$message.success(flag ? '新增成功' : '修改成功')
                    this.addFormBtn.show = false
                    this.init()
                }
            })
        },
        handleSearch () {
            this.init()
        },
        init () {
            this.tableData.loading = true
            let params = {
                menuName: this.queryForm.menuName,
                createTimeFrom: this.queryForm.time[0],
                createTimeTo: this.queryForm.time[1]
            }
            this.$get('/menu', params).then((res) => {
                if (res) {
                    this.tableData.rows = res.rows.children
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        },
        // 遍历树结构，删除type=1的节点，按钮只能作为子节点
        getNoBtnTree (data) {
            // data.forEach((a, i) => {
            //     if (a.type === '1') {
            //         data.splice(i, 1)
            //     }
            //     if (a.children) {
            //         this.getNoBtnTree(a.children)
            //     } else {
            //         return false
            //     }
            // })
            for (let i = 0, l = data.length; i < l; i++) {
                if (data[i].type === '1') {
                    data[i].disabled = true
                }
                if (data[i].children) {
                    this.getNoBtnTree(data[i].children)
                }
            }
            return data
        },
        handleAddMenu (flag, item) {
            if (flag) {
                this.addFormMenu.title = '新增菜单'
                this.addFormMenu.form = {
                    icon: null,
                    menuName: null,
                    path: null,
                    component: null,
                    perms: null,
                    orderNum: null,
                    parentId: null,
                    type: item
                }
            } else {
                this.addFormMenu.title = '修改菜单'
                this.addFormMenu.form = {
                    icon: item.icon,
                    menuName: item.text,
                    path: item.path,
                    component: item.component,
                    perms: item.permission,
                    orderNum: item.order,
                    parentId: item.parentId,
                    menuId: item.id,
                    type: item.type
                }
            }
            this.$get('/menu').then(res => {
                this.addFormMenu.treeDataNoBtn = this.getNoBtnTree(res.rows.children)
            })
            this.addFormMenu.show = true
        },
        handleAddBtn (flag, item) {
            if (flag) {
                this.addFormBtn.title = '新增按钮'
                this.addFormBtn.form = {
                    perms: null,
                    menuName: null,
                    parentId: null,
                    type: item
                }
            } else {
                this.addFormBtn.title = '修改按钮'
                this.addFormBtn.form = {
                    perms: item.permission,
                    menuName: item.text,
                    parentId: item.parentId,
                    menuId: item.id,
                    type: item.type
                }
            }
            this.$get('/menu').then(res => {
                this.addFormBtn.treeDataNoBtn = this.getNoBtnTree(res.rows.children)
            })
            this.addFormBtn.show = true
        },
        handleReset () {
            this.queryForm = {
                menuName: null,
                time: ['', '']
            }
            this.init()
        }
    }
}
</script>

<style lang="less">
.system-menu {
    .el-dropdown {
        margin-right: 16px;
    }
    .box-mid {
        .el-dropdown {
            margin-right: 10px;
        }
    }
    .menuTableIcon {
        font-size: 20px;
        vertical-align: middle;
    }
}
</style>
