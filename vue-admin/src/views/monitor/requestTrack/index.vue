<template>
<div class="monitor-track box-wrap">
    <div class="monitor-track-top">
        <i class="el-icon-success"></i>
        <span class="tips">共追踪到 {{tableData.length}} 条近期HTTP请求记录</span>
        <el-button type="text" v-preventReClick="2000" @click="init">点击刷新</el-button>
    </div>
    <div class="box-table table-wrap">
        <el-table height="100%" :data="list" tooltip-effect="dark" v-loading="loading">
            <template slot="empty">
                <no-data :types="false">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column label="请求时间" show-overflow-tooltip>
                <template slot-scope="scope">{{getTime(scope.row.timestamp)}}</template>
            </el-table-column>
            <el-table-column label="请求方法" show-overflow-tooltip>
                <template slot-scope="scope"><el-tag type="success">{{scope.row.request.method}}</el-tag></template>
            </el-table-column>
            <el-table-column label="请求URL" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.request.uri}}</template>
            </el-table-column>
            <el-table-column label="响应状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <template v-if="scope.row.response.status<200"><el-tag>{{scope.row.response.status}}</el-tag></template>
                    <template v-else-if="scope.row.response.status<201"><el-tag type="success">{{scope.row.response.status}}</el-tag></template>
                    <template v-else-if="scope.row.response.status<399"><el-tag type="info">{{scope.row.response.status}}</el-tag></template>
                    <template v-else-if="scope.row.response.status<403"><el-tag type="warning">{{scope.row.response.status}}</el-tag></template>
                    <template v-else-if="scope.row.response.status<501"><el-tag type="danger">{{scope.row.response.status}}</el-tag></template>
                    <template v-else><el-tag type="info">{{scope.row.response.status}}</el-tag></template>
                </template>
            </el-table-column>
            <el-table-column label="请求耗时" show-overflow-tooltip>
                <template slot-scope="scope">
                    <template v-if="scope.row.timeTaken<=500"><el-tag type="success">{{scope.row.timeTaken}}ms</el-tag></template>
                    <template v-else-if="scope.row.timeTaken<=1000"><el-tag type="info">{{scope.row.timeTaken}}ms</el-tag></template>
                    <template v-else-if="scope.row.timeTaken<=1500"><el-tag type="warning">{{scope.row.timeTaken}}ms</el-tag></template>
                    <template v-else><el-tag type="danger">{{scope.row.timeTaken}}ms</el-tag></template>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="box-pagenation" :class="{'box-pagenation-1': !menuMode}" v-if="tableData.length>0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</div>
</template>

<script>
import NoData from '@/components/NoData'
import axios from '@/js/axios'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
    name: 'RequestTrack',
    components: { NoData },
    data () {
        return {
            list: [],
            loading: false,
            tableData: [],
            pageSize: 10,
            currentPage: 1,
            total: 0
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
        getTime (t) {
            return moment(t).format('YYYY-MM-DD HH:mm:ss')
        },
        load () {
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 500)
        },
        init () {
            this.currentPage = 1
            this.pageSize = 10
            this.get('/actuator/httptrace', {})
            this.load()
        },
        async get (url, params) {
            try {
                let { data } = await axios.get(url, { params: params })
                if (data) {
                    this.tableData = data.traces
                    this.total = data.traces.length
                    this.getList()
                } else {
                    this.$message.error('网络错误，请稍后再试')
                }
            } catch (error) {
                console.log(error)
            }
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.getList()
        },
        handleSizeChange (val) {
            this.pageSize = val
            this.getList()
        },
        getList () {
            this.load()
            let from = (this.currentPage - 1) * this.pageSize
            let to = this.currentPage * this.pageSize
            this.list = []
            for (; from < to; from++) {
                if (this.tableData[from]) {
                    this.list.push(this.tableData[from])
                }
            }
        }
    }
}
</script>

<style lang="less">
.monitor-track {
    .monitor-track-top {
        margin-bottom: 16px;
        padding: 0px 16px;
        width: 100%;
        border: 1px solid #b7eb8f;
        background-color: #f6ffed;
        display: flex;
        align-items: center;
        .el-icon-success {
            color: #52c41a;
            margin-right: 10px;
        }
        .tips {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
        }
    }
}
</style>
