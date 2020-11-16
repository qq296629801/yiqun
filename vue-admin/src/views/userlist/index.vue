<template>
<div class="system-user box-wrap">
    <el-form @submit.native.prevent>
        <el-form-item class="left">
            <el-input
                @keyup.enter.native="handleSearch(true)"
                @clear="handleSearch(true)"
                clearable
                placeholder="请输入用户名"
                v-model="queryForm.username">
                <i @click="handleSearch(true)" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
        <el-form-item class="left">
            <el-select ref="treeSelect" popper-class="deptSelectDown" @clear="handleClear" clearable v-model="queryForm.deptId" placeholder="请选择部门">
                <el-option
                    :label="deptLabel"
                    :value="queryForm.deptId">
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
        <el-form-item class="right">
            <el-button type="primary" v-hasPermission="'user:add'" @click="handleAdd(false)">新增</el-button>
            <el-button v-hasPermission="'user:export'" v-preventReClick="2000" @click="handleExport">导出Excel</el-button>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @flash="handleSearch" @add="handleAdd"></table-list>
    <add-dialog v-if="addForm.show" :addForm="addForm" @save="handleSave"></add-dialog>
</div>
</template>

<script>
import AddDialog from './AddDialog'
import TableList from './TableList'
import moment from 'moment'
export default {
    name: 'User',
    components: {
        AddDialog,
        TableList
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
                title: '新增用户',
                form: {}
            },
            queryForm: {
                username: null,
                deptId: null,
                time: ['', '']
            },
            labelProp: {
                label: 'title'
            },
            deptLabel: '',
            depList: []
        }
    },
    created () {
        this.init()
        this.getDeps()
    },
    methods: {
        handleClear () {
            this.deptLabel = ''
            this.handleSearch(true)
        },
        nodeClick (target, node) {
            this.queryForm.deptId = target.id
            this.deptLabel = target.title
            this.$refs.treeSelect.blur()
            this.handleSearch(true)
        },
        getDeps () {
            this.$get('/dept', {}).then(res => {
                if (res) {
                    this.depList = res.rows.children
                }
            })
        },
        handleExport () {
            const {
                username,
                deptId,
                time
            } = this.queryForm
            const params = {
                username,
                deptId,
                createTimeFrom: time[0] && moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
                createTimeTo: time[1] && moment(time[1]).format('YYYY-MM-DD HH:mm:ss')
            }
            this.$download('/user/excel', params).then(res => {
                if (res) {
                    this.$message.success('导出成功')
                }
            })
        },
        handleSave () {
            let flag = this.addForm.title === '新增用户'
            if (typeof this.addForm.form.roleId !== 'string') {
                this.addForm.form.roleId = this.addForm.form.roleId.join(',')
            }
            this[flag ? '$formDataType2' : '$put']('/user', this.addForm.form).then(res => {
                if (res) {
                    this.$message.success(flag ? '新增成功' : '修改成功')
                    this.addForm.show = false
                    this.init()
                } else {
                    this.addForm.form.roleId = this.addForm.form.roleId.split(',').map(v => +v)
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
                username: this.queryForm.username,
                deptId: this.queryForm.deptId,
                createTimeFrom: this.queryForm.time[0],
                createTimeTo: this.queryForm.time[1]
            }
            this.$get('/user/queryUserByCurrent', params).then((res) => {
                if (res) {
                    this.tableData.rows = res.rows
                    this.tableData.total = res.total
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        },
        handleAdd (item) {
            if (!item) {
                this.addForm = {
                    title: '新增用户',
                    show: true,
                    form: {
                        username: null,
                        realname: null,
                        roleId: [],
                        deptId: null,
                        status: null,
                        ssex: null
                    }
                }
            } else {
                this.addForm = {
                    title: '修改用户',
                    show: true,
                    form: {
                        username: item.username,
                        realname: item.realname,
                        roleId: item.roleId.split(',').map(v => parseInt(v)),
                        deptId: item.deptId && item.deptId.toString(),
                        status: item.status,
                        ssex: item.ssex,
                        userId: item.userId
                    }
                }
            }
        },
        handleReset () {
            this.queryForm = {
                username: null,
                deptId: null,
                time: ['', '']
            }
            this.tableData.currentPage = 1
            this.init()
        }
    }
}
</script>

<style lang="less">
.system-user {
    .el-form {
        .left {
            float: left;
            & + .left {
                margin-left: 16px;
            }
        }
        .right {
            float: right;
        }
    }
}
</style>
