<template>
<div class="projectsMember box-wrap">
    <el-form class="el-form-between" @submit.native.prevent>
        <el-form-item>
            <el-input
                @keyup.enter.native="handleSearch(true)"
                @clear="handleSearch(true)"
                placeholder="请输入用户名"
                clearable
                v-model="queryForm.name">
                <i @click="handleSearch(true)" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addForm.show=true">新增成员</el-button>
            <el-button type="primary" @click="handleClickAllProhibitions(1)">全体禁言</el-button>
            <el-button type="primary" @click="handleClickAllProhibitions(0)">全体解禁</el-button>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @flash="handleSearch" @check="handleCheck" @add="addForm.show=true"></table-list>
    <add-dialog v-if="addForm.show" :addForm="addForm" @save="handleSave"></add-dialog>
    <check-dialog v-if="checkForm.show" :checkForm="checkForm"></check-dialog>
</div>
</template>

<script>
import AddDialog from './AddDialog'
import TableList from './TableList'
import CheckDialog from './CheckDialog'
export default {
    name: 'ProjectsMember',
    components: {
        AddDialog,
        TableList,
        CheckDialog
    },
    data () {
        const groupId = JSON.parse(localStorage.getItem('groupInfo')).id
        return {
            groupId,
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
                title: '添加成员'
            },
            checkForm: {
                show: false,
                form: {}
            },
            queryForm: {
                name: ''
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        handleClickAllProhibitions (val) {
            const params = {
                groupId: this.groupId,
                status: val
            }
            this.$post('/group/updateGroupUserStatus', params).then(res => {
                if (res) {
                    this.$message.success('操作成功')
                    this.init()
                }
            })
        },
        handleSave (operId) {
            const params = {
                groupId: this.groupId,
                users: operId
            }
            this.$post('/group/addUser', params).then(res => {
                if (res) {
                    this.$message.success('保存成功')
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
            const {
                name
            } = this.queryForm
            const {
                pageSize,
                currentPage
            } = this.tableData
            const params = {
                keyword: name,
                groupId: this.groupId,
                pageSize: pageSize,
                pageNum: currentPage
            }
            this.tableData.loading = true
            this.$post('/group/queryUsers', params).then(res => {
                if (res) {
                    this.tableData.rows = res.rows
                    this.tableData.total = res.total
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        },
        handleCheck (value) {
            this.$get(`/user/${value.userName}`).then(res => {
                this.checkForm = {
                    show: true,
                    form: res
                }
            })
        }
    }
}
</script>
