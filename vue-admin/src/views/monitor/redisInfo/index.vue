<template>
<div class="monitor-redis self-background">
    <div class="top">
        <el-card class="card-1" shadow="hover">
            <div slot="header" class="clearfix">Redis内存实时占用情况（kb）</div>
            <ve-line :loading="chartLoading" :legend-visible="false" width="100%" height="400px" :data="chartData1" :settings="chartSettings1"></ve-line>
        </el-card>
        <el-card class="card-2" shadow="hover">
            <div slot="header" class="clearfix">Redis key实时数量（个）</div>
            <ve-line :loading="chartLoading" :legend-visible="false" width="100%" height="400px" :data="chartData2" :settings="chartSettings2"></ve-line>
        </el-card>
    </div>
    <el-card shadow="hover">
        <div slot="header" class="clearfix">Redis详细信息</div>
        <el-table :data="tableData" tooltip-effect="dark" :show-header="false" v-loading="loading">
            <template slot="empty">
                <no-data :types="isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column prop="key" label="I" show-overflow-tooltip></el-table-column>
            <el-table-column prop="description" label="love" show-overflow-tooltip></el-table-column>
            <el-table-column prop="value" label="you" show-overflow-tooltip></el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<script>
import NoData from '@/components/NoData'
import moment from 'moment'
export default {
    name: 'RedisInfo',
    components: { NoData },
    data () {
        return {
            chartLoading: false,
            chartSettings1: {
                area: true,
                labelMap: {
                    value: '内存(kb)'
                }
            },
            chartSettings2: {
                area: true,
                labelMap: {
                    value: 'key数量'
                }
            },
            chartData1: {
                columns: ['time', 'value'],
                rows: []
            },
            chartData2: {
                columns: ['time', 'value'],
                rows: []
            },
            timer: null,
            loading: false,
            tableData: [],
            isSearch: false
        }
    },
    created () {
        this.init()
        this.getChartData()
    },
    destroyed () {
        if (this.timer) {
            clearInterval(this.timer)
        }
    },
    methods: {
        init () {
            this.loading = true
            this.$get('/redis/info', {}).then(res => {
                if (res) {
                    this.tableData = res
                }
            }).finally(() => {
                this.loading = false
            })
        },
        getChartData () {
            this.chartLoading = true
            let minMemory = 1e10
            let minSize = 1e10
            let maxMemory = -1e10
            let maxSize = -1e10
            this.timer = setInterval(() => {
                this.$get('/redis/memoryInfo', {}).then(res => {
                    if (res) {
                        let currentMemory = (res.used_memory / 1000).toFixed(2)
                        this.$get('/redis/keysSize', {}).then(res => {
                            if (res) {
                                let currentSize = res.dbSize
                                if (currentMemory < minMemory) minMemory = currentMemory
                                if (currentMemory > maxMemory) maxMemory = currentMemory
                                if (currentSize < minSize) minSize = currentSize
                                if (currentSize > maxSize) maxSize = currentSize
                                let time = moment().format('hh:mm:ss')
                                this.chartData1.rows.push({ time, value: currentMemory })
                                this.chartData2.rows.push({ time, value: currentSize })
                                if (this.chartData1.rows.length >= 6) this.chartData1.rows.shift()
                                if (this.chartData2.rows.length >= 6) this.chartData2.rows.shift()
                            }
                        })
                    }
                })
                this.chartLoading = false
            }, 3000)
        }
    }
}
</script>

<style lang="less" scoped>
.monitor-redis {
    .el-card {
        margin-bottom: 16px;
    }
    .top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .el-card {
            width: 50%;
        }
        .card-1 {
            margin-right: 8px;
        }
        .card-2 {
            margin-left: 8px;
        }
    }
}
</style>
