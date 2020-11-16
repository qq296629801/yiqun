<template>
<div class="syslogs-table table-wrap">
    <div class="box-table">
        <el-table height="100%" :data="tableData.rows" tooltip-effect="dark" v-loading="tableData.loading" @selection-change="selectedChange">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" label="操作人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operation" label="操作描述" show-overflow-tooltip></el-table-column>
            <el-table-column label="耗时" show-overflow-tooltip>
                <template slot-scope="scope">
                    <template v-if="scope.row.time<=500"><el-tag type="success">{{scope.row.time}}ms</el-tag></template>
                    <template v-else-if="scope.row.time<=1000"><el-tag type="info">{{scope.row.time}}ms</el-tag></template>
                    <template v-else-if="scope.row.time<=1500"><el-tag type="warning">{{scope.row.time}}ms</el-tag></template>
                    <template v-else><el-tag type="danger">{{scope.row.time}}ms</el-tag></template>
                </template>
            </el-table-column>
            <el-table-column prop="method" label="执行方法" show-overflow-tooltip></el-table-column>
            <el-table-column prop="params" label="方法参数" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" label="IP地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="location" label="操作地点" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip></el-table-column>
        </el-table>
    </div>
    <div class="box-pagenation" :class="{'box-pagenation-1': !menuMode}" v-if="tableData.rows.length>0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.currentPage" :page-size="tableData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
    </div>
</div>
</template>

<script>
import NoData from '@/components/NoData'
import { mapGetters } from 'vuex'
export default {
    name: 'syslogsTable',
    components: { NoData },
    props: {
        tableData: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            menuMode: 'common/getMenuMode'
        })
    },
    data () {
        return {
            selected: []
        }
    },
    methods: {
        selectedChange (val) {
            this.selected = val
        },
        handleCurrentChange (val) {
            this.tableData.currentPage = val
            this.$emit('flash')
        },
        handleSizeChange (val) {
            this.tableData.pageSize = val
            this.$emit('flash')
        }
    }
}
</script>
