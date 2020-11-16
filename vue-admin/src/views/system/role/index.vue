<template>
<div class="system-role box-wrap">
    <el-form class="el-form-between" @submit.native.prevent>
        <el-form-item>
            <el-input
                @keyup.enter.native="handleSearch(true)"
                @clear="handleSearch(true)"
                placeholder="请输入角色"
                clearable
                v-model="queryForm.roleName">
                <i @click="handleSearch(true)" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button v-hasPermission="'role:add'" type="primary" @click="handleAdd(false, '新增')">新增</el-button>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @flash="handleSearch" @add="handleAdd"></table-list>
    <role-drawer v-if="addForm.show" :addForm="addForm" @save="handleSave"></role-drawer>
</div>
</template>

<script>
import RoleDrawer from './RoleDrawer'
import TableList from './TableList'
export default {
    name: 'Role',
    components: {
        TableList,
        RoleDrawer
    },
    data () {
        return {
            tableData: {
                isSearch: false,
                total: 0,
                pageSize: 10,
                currentPage: 1,
                loading: false,
                rows: []
            },
            addForm: {
                show: false,
                title: '新增',
                form: {}
            },
            queryForm: {
                roleName: null,
                time: ['', '']
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        handleSave () {
            let flag = this.addForm.title === '新增角色'
            this[flag ? '$formDataType2' : '$put']('/role', this.addForm.form).then(res => {
                if (res) {
                    this.$message.success(flag ? '新增成功' : '修改成功')
                    this.addForm.show = false
                    this.init()
                }
            })
        },
        handleSearch (flag) {
            if (flag) {
                this.tableData.currentPage = 1
            }
            this.tableData.isSearch = true
            this.init()
        },
        init () {
            this.tableData.loading = true
            let params = {
                pageNum: this.tableData.currentPage,
                pageSize: this.tableData.pageSize,
                roleName: this.queryForm.roleName,
                createTimeFrom: this.queryForm.time[0],
                createTimeTo: this.queryForm.time[1]
            }
            this.$get('/role', params).then((res) => {
                if (res) {
                    this.tableData.rows = res.rows
                    this.tableData.total = res.total
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        },
        handleAdd (item, val) {
            switch (val) {
                case '新增':
                    this.addForm.title = '新增角色'
                    this.addForm.form = {
                        roleName: null,
                        remark: null,
                        menuId: '0'
                    }
                break
                case '修改':
                    this.addForm.title = '修改角色'
                    this.addForm.form = {
                        roleName: item.roleName,
                        remark: item.remark,
                        roleId: item.roleId,
                        menuId: '0'
                    }
                break
                case '查看':
                    this.addForm.title = '角色信息'
                    this.addForm.form = {
                        roleName: item.roleName,
                        remark: item.remark,
                        createTime: item.createTime,
                        modifyTime: item.modifyTime,
                        roleId: item.roleId
                    }
                break
            }
            this.addForm.show = true
        },
        handleReset () {
            this.queryForm = {
                roleName: null,
                time: ['', '']
            }
            this.tableData.currentPage = 1
            this.init()
        }
    }
}
</script>
