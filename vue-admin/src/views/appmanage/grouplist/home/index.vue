<template>
<div class="projects box-wrap">
    <el-form @submit.native.prevent>
        <el-form-item>
            <el-input
                @keyup.enter.native="handleSearch(true)"
                @clear="handleSearch(true)"
                placeholder="请输入群名称"
                clearable
                v-model="queryForm.name">
                <i @click="handleSearch(true)" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button v-hasPermission="'group:addgroup'" type="primary" @click="resetForm">新增群</el-button>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @flash="handleSearch"></table-list>
    <add-dialog v-if="addForm.show" :addForm="addForm" @save="handleSave"></add-dialog>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddDialog from './AddDialog'
import TableList from './TableList'
export default {
    name: 'ProjectsIndex',
    components: {
        AddDialog,
        TableList
    },
    data () {
        const role = localStorage.getItem('ROLES')
        return {
            role,
            tableData: {
                loading: false,
                total: 0,
                pageSize: 10,
                currentPage: 1,
                isSearch: false,
                rows: []
            },
            addForm: {
                show: false,
                title: '新增群',
                form: {
                    groupName: null,
                    avatar: null
                }
            },
            queryForm: {
                name: null
            },
            sortOrder: true
        }
    },
    computed: {
        ...mapGetters({
            menuMode: 'common/getMenuMode'
        })
    },
    created () {
        this.init()
    },
    methods: {
        handleSave () {
            this.$post('/group/create', this.addForm.form).then(res => {
                if (res) {
                    this.$message.success('保存成功')
                    this.addForm.show = false
                    this.init()
                }
            })
        },
        handleSearch (flag) {
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
                pageSize: pageSize,
                pageNum: currentPage,
                keyword: name
            }
            this.tableData.loading = true
            this.$post('/group/queryGroupByUser', params).then(res => {
                if (res) {
                    this.tableData.rows = res.rows
                    this.tableData.total = res.total
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        },
        resetForm () {
            this.addForm = {
                show: true,
                title: '新增群',
                form: {
                    groupName: null,
                    avatar: null
                }
            }
        }
    }
}
</script>

<style lang="less">
.projects {
    .is-active {
        color: #2680EB !important;
    }
    .is-round {
        line-height: 22px;
        margin-right: 33px;
        padding: 0 12px;
        min-width: 0;
    }
    .el-form {
        display: flex;
        justify-content: space-between;
        .el-input {
            margin-right: 16px;
        }
        .el-button {
            margin-left: 33px;
        }
        .iconfont {
            cursor: pointer;
        }
        .icon-liebiao {
            margin-right: 12px;
        }
    }
}
</style>
