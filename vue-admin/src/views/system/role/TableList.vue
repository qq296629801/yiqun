<template>
<div class="table-wrap">
    <div class="box-table">
        <el-table height="100%" v-loading="tableData.loading" :data="tableData.rows" tooltip-effect="dark" @sort-change="tableSortChange" :default-sort="tableSortCondition">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column prop="roleName" label="角色" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="描述" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="modifyTime" label="修改时间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-hasPermission="'role:update'" @click="$emit('add', scope.row, '修改')" type="text">修改</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button @click="$emit('add', scope.row, '查看')" type="text">查看</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button v-hasPermission="'role:delete'" @click="handleDel(scope.row.roleId)" type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="box-pagenation" :class="{'box-pagenation-1': !menuMode}" v-if="tableData.rows.length>0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.currentPage" :page-size="tableData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
    </div>
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations
} from 'vuex'
import NoData from '@/components/NoData'
export default {
    name: 'ProjectsTable',
    props: {
        tableData: {
            type: Object,
            required: true
        }
    },
    components: { NoData },
    computed: {
        ...mapGetters({
            menuMode: 'common/getMenuMode',
            tableSortCondition: 'common/getTableSortCondition'
        })
    },
    methods: {
        ...mapMutations({
            setTableSortCondition: 'common/setTableSortCondition'
        }),
        handleDel (roleId) {
            this.$confirm('确定要删除该角色吗？', '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                type: 'warning'
            }).then(() => {
                this.handleDelConfirm(roleId)
            }).catch(() => {})
        },
        handleDelConfirm (roleId) {
            this.$delete('/role', roleId).then(res => {
                    if (res) {
                        this.$message.success('删除成功')
                        this.$emit('flash')
                    }
                })
        },
        handleCurrentChange (val) {
            this.tableData.currentPage = val
            this.$emit('flash')
        },
        handleSizeChange (val) {
            this.tableData.pageSize = val
            this.$emit('flash')
        },
        tableSortChange (val) {
            let data = {
                prop: val.prop,
                order: val.order
            }
            this.setTableSortCondition(data)
        }
    }
}
</script>
