<template>
<div class="table-wrap">
    <div class="box-table">
        <el-table height="100%" v-loading="tableData.loading" :data="tableData.rows" tooltip-effect="dark" @sort-change="tableSortChange" :default-sort="tableSortCondition">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column prop="username" sortable label="用户名" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column prop="realname" label="真实姓名" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column
                prop="ssex"
                :filters="[
                    {text: '男', value: '0'},
                    {text: '女', value: '1'},
                    {text: '保密', value: '2'}
                ]"
                :filter-method="filterHandler"
                label="性别"
                show-overflow-tooltip
                width="70">
                <template slot-scope="scope">
                    <template v-if="scope.row.ssex==='0'">男</template>
                    <template v-else-if="scope.row.ssex==='1'">女</template>
                    <template v-else-if="scope.row.ssex==='2'">保密</template>
                    <template v-else>--</template>
                </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="部门" show-overflow-tooltip width="100"></el-table-column>
            <el-table-column prop="mobile" label="电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="money" label="积分" show-overflow-tooltip></el-table-column>
            <!-- {text: '未分配', value: '2'}
            {text: '已注销', value: '3'} -->
            <el-table-column
                prop="status"
                :filters="[
                    {text: '锁定', value: '0'},
                    {text: '有效', value: '1'}
                ]"
                :filter-method="filterHandler"
                label="状态"
                show-overflow-tooltip
                width="70">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.status === '1' ? 'primary' : 'danger'"
                    disable-transitions>{{scope.row.status==='0'?'锁定':'有效'}}</el-tag>
                    <!-- {{scope.row.status==='0'?'锁定':scope.row.status==='1'?'有效':scope.row.status==='2'?'未分配':'已注销'}} -->
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="userInfoOperate(scope.row)" type="text">编辑</el-button>
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
    data () {
        return {
            username: JSON.parse(localStorage.getItem('USER')).username
        }
    },
    computed: {
        ...mapGetters({
            menuMode: 'common/getMenuMode',
            tableSortCondition: 'common/getTableSortCondition'
        })
    },
    methods: {
        ...mapMutations({
            setUserInfo: 'common/setUserInfo',
            setTableSortCondition: 'common/setTableSortCondition'
        }),
        userInfoOperate (val) {
            this.setUserInfo(val)
            this.$router.push(`/userSet/${val.userId}`)
        },
        filterHandler (value, row, column) {
            const property = column['property']
            return row[property] === value
        },
        handleReset (usernames) {
            this.$confirm('确定要重置该用户的密码吗？', '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                type: 'warning'
            }).then(() => {
                this.handleResetConfirm({ usernames })
            }).catch(() => {})
        },
        handleResetConfirm (params) {
            this.$put('/user/password/reset', params).then(res => {
                if (res) {
                    this.$message.success('重置成功')
                }
            })
        },
        handleRemove (userId) {
            this.$confirm('确定要删除该用户吗？', '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                type: 'warning'
            }).then(() => {
                this.handleRemoveConfirm(userId)
            }).catch(() => {})
        },
        handleRemoveConfirm (params) {
            this.$delete('/user', params).then(res => {
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
