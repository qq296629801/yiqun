<template>
<div class="system-dep box-wrap">
    <el-form class="el-form-between" @submit.native.prevent>
        <el-form-item>
            <el-input
                @keyup.enter.native="handleSearch"
                @clear="handleSearch"
                placeholder="请输入部门名称"
                clearable
                v-model="queryForm.deptName">
                <i @click="handleSearch" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button v-hasPermission="'dept:add'" type="primary" @click="handleAdd(false)">新增</el-button>
            <el-button v-hasPermission="'dept:delete'" @click="handleDel">删除</el-button>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @select="selectTableData" @flash="handleSearch" @add="handleAdd"></table-list>
    <add-dialog v-if="addForm.show" :addForm="addForm" @save="handleSave"></add-dialog>
</div>
</template>

<script>
import AddDialog from './AddDialog'
import TableList from './TableList'
export default {
    name: 'Dep',
    components: {
        AddDialog,
        TableList
    },
    data () {
        return {
            tableData: {
                isSearch: false,
                loading: false,
                rows: []
            },
            addForm: {
                show: false,
                title: '新增部门',
                treeData: [],
                form: {
                    deptName: null,
                    orderNum: null,
                    parentId: null
                }
            },
            queryForm: {
                deptName: '',
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
                this.$message.info('请选择要删除的部门')
            } else {
                this.$confirm('确定要删除该部门吗？<br/>删除之后该部门下的用户将没有归属部门，请确认后再进行删除。', '提示', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    this.handleDelConfirm()
                }).catch(() => {})
            }
        },
        handleDelConfirm () {
            this.$delete('/dept', this.selected.map(v => v.id).join(',')).then(res => {
                if (res) {
                    this.$message.success('删除成功')
                    this.handleSearch()
                }
            })
        },
        handleSave () {
            let flag = this.addForm.title === '新增部门'
            this[flag ? '$formDataType2' : '$put']('/dept', this.addForm.form).then(res => {
                if (res) {
                    this.$message.success(flag ? '新增成功' : '修改成功')
                    this.addForm.show = false
                    this.init()
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
                deptName: this.queryForm.deptName,
                createTimeFrom: this.queryForm.time[0],
                createTimeTo: this.queryForm.time[1]
            }
            this.$get('/dept', params).then(res => {
                if (res) {
                    this.tableData.rows = res.rows.children
                    this.addForm.treeData = res.rows.children
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        },
        handleAdd (item) {
            if (!item) {
                this.addForm.title = '新增部门'
                this.addForm.form = {
                    deptName: null,
                    orderNum: null,
                    parentId: null
                }
            } else {
                this.addForm.title = '修改部门'
                this.addForm.form = {
                    deptName: item.text,
                    orderNum: item.order,
                    deptId: item.id,
                    parentId: item.parentId
                }
            }
            this.addForm.show = true
        },
        handleReset () {
            this.queryForm = {
                deptName: null,
                time: ['', '']
            }
            this.init()
        }
    }
}
</script>
