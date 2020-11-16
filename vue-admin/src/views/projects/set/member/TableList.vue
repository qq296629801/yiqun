<template>
<div class="table-wrap">
    <div class="box-table">
        <el-table height="100%" v-loading="tableData.loading" :data="tableData.rows" tooltip-effect="dark" @sort-change="tableSortChange" :default-sort="tableSortCondition">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column prop="userId" label="编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userName" label="用户名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="money" label="积分" show-overflow-tooltip></el-table-column>
            <el-table-column prop="nickName" label="昵称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operTime" label="加入时间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="操作" min-width="160">
                <template slot-scope="scope">
                    <span style="margin-right: 12px" v-if="!scope.row.owner">
                        <el-button @click="handleExchangeIntegral(scope.row)" type="text">兑换积分</el-button>
                        <el-button @click="setMaster(scope.row)" type="text">{{scope.row.masterStatus?'解除管理员':'设为管理员'}}</el-button>
                        <el-button @click="chengeProhibitions(scope.row)" type="text">{{!scope.row.status?'禁言':'解除禁言'}}</el-button>
                        <el-button @click="handleRemove(scope.row)" type="text">移出成员</el-button>
                    </span>
                    <el-button @click="$emit('check', scope.row)" type="text">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-dialog @close="closeDialog" title="兑换积分" :visible.sync="exchangeIntegral" width="30%">
        <el-input-number style="width: 100%" v-model="integral" controls-position="right"></el-input-number>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="handleDiologCheck">确 定</el-button>
        </span>
    </el-dialog>
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
        const groupInfo = JSON.parse(localStorage.getItem('groupInfo'))
        return {
            exchangeIntegral: false,
            integral: null,
            groupInfo,
            currentMemberUserId: null,
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
            setTableSortCondition: 'common/setTableSortCondition'
        }),
        handleExchangeIntegral (item) {
            this.exchangeIntegral = true
            this.currentMemberUserId = item.userId
        },
        closeDialog () {
            this.exchangeIntegral = false
            this.integral = null
        },
        handleDiologCheck () {
            let params = {
                id: this.currentMemberUserId,
                money: this.integral
            }
            this.$post('/money/exchange', params).then(res => {
                this.$emit('flash')
                this.$message.success('兑换成功')
                this.exchangeIntegral = false
                this.integral = 0
            })
        },
        chengeProhibitions (item) {
            let params = {
                groupId: this.groupInfo.id,
                userId: item.userId,
                status: item.status ? 0 : 1
            }
            this.$post('/group/editGroupStatus', params).then(res => {
                if (!item.status) {
                    this.$message.success('设置成功')
                } else {
                    this.$message.success('解除成功')
                }
                this.$emit('flash')
            })
        },
        setMaster (item) {
            let params = {
                groupId: this.groupInfo.id,
                userId: item.userId,
                masterStatus: !item.masterStatus
            }
            this.$post('/group/editGroupOwner', params).then(res => {
                if (params.masterStatus) {
                    this.$message.success('设置成功')
                } else {
                    this.$message.success('解除成功')
                }
                this.$emit('flash')
            })
        },
        handleRemove (item) {
            this.$confirm(`确定要移出群成员<span>[${item.userName}]</span>吗？移出后，该用户不再是<span>[${this.groupInfo.groupName}]</span>的成员`, '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                showClose: false,
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                const params = {
                    groupId: this.groupInfo.id,
                    users: [item.userId]
                }
                this.$post('/group/removeGroupUsers', params).then(res => {
                    if (res) {
                        this.$message.success('删除成功')
                        this.$emit('flash')
                    }
                })
            }).catch(() => {})
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
