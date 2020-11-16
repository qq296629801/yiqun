<template>
<div class="system-dep box-wrap">
    <el-form class="el-form-between" @submit.native.prevent>
        <el-form-item>
            <el-input
                @keyup.enter.native="handleSearch"
                @clear="handleSearch"
                placeholder="请输入姓名"
                clearable
                v-model="queryForm.name">
                <i @click="handleSearch" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="handleDel">删除</el-button>
            <el-button v-preventReClick="2000" @click="handleExport">导出Excel</el-button>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @select="selectTableData" @flash="handleSearch"></table-list>
</div>
</template>

<script>
import TableList from './TableList'
export default {
    name: 'AddressList',
    components: {
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
            queryForm: {
                name: '',
                time: ['', '']
            },
            selected: []
        }
    },
    created () {
        this.init()
    },
    methods: {
        handleExport () {
            let ids = this.tableData.rows.map(v => v.id)
            const params = {
                ids
            }
            this.$download('/contact/download', params).then(res => {
                if (res) {
                    this.$message.success('导出成功')
                }
            })
        },
        selectTableData (val) {
            this.selected = val
        },
        handleDel () {
            if (!this.selected.length) {
                this.$message.info('请选择要删除的部门')
            } else {
                this.$confirm('是否确认删除该信息', '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    this.handleDelConfirm()
                }).catch(() => {})
            }
        },
        handleDelConfirm () {
            let params = {
                ids: this.selected.map(v => v.id)
            }
            this.$post('/contact/deleteContact', params).then(res => {
                if (res) {
                    this.$message.success('删除成功')
                    this.handleSearch()
                }
            })
        },
        handleSearch () {
            this.tableData.isSearch = true
            this.init()
        },
        init () {
            this.tableData.loading = true
            let params = {
                pageNum: this.tableData.currentPage,
                pageSize: this.tableData.pageSize,
                keyword: this.queryForm.name
            }
            this.$post('/contact/queryContacts', params).then(res => {
                if (res) {
                    this.tableData.rows = res.rows
                    this.tableData.total = res.total
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        }
    }
}
</script>
