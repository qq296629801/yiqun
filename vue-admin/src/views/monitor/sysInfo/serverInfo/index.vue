<template>
<div class="server-info box-wrap">
    <div class="server-info-top">
        <i class="el-icon-success"></i>
        <span class="tips">数据获取时间 {{time}}</span>
        <el-button type="text" v-preventReClick="2000" @click="init">点击刷新</el-button>
    </div>
    <div class="box-table table-wrap" style="padding-bottom:0">
        <el-table height="100%" :data="list" tooltip-effect="dark" v-loading="loading">
            <template slot="empty">
                <no-data :types="false">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column label="参数" show-overflow-tooltip>
                <template slot-scope="scope"><el-tag :type="scope.row.type">{{scope.row.name}}</el-tag></template>
            </el-table-column>
            <el-table-column label="描述" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.desc}}</template>
            </el-table-column>
            <el-table-column label="当前值" show-overflow-tooltip>
                <template slot-scope="scope">{{`${scope.row.value} ${scope.row.unit}`}}</template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
import NoData from '@/components/NoData'
import axios from '@/js/axios'
import moment from 'moment'
export default {
    name: 'JvmInfo',
    components: { NoData },
    data () {
        return {
            time: null,
            loading: false,
            list: [
                { unit: '核', value: null, type: '', name: 'system.cpu.count', desc: 'CPU 数量' },
                { unit: '%', value: null, type: '', name: 'system.cpu.usage', desc: '系统 CPU 使用率' },
                { unit: '', value: null, type: '', name: 'process.start.time', desc: '应用启动时间点' },
                { unit: '秒', value: null, type: 'info', name: 'process.uptime', desc: '应用已运行时间' },
                { unit: '%', value: null, type: 'info', name: 'process.cpu.usage', desc: '当前应用 CPU 使用率' }
            ]
        }
    },
    created () {
        this.init()
    },
    methods: {
        getTime (t) {
            return moment(t).format('YYYY-MM-DD HH:mm:ss')
        },
        convert (val) {
            return Number(val * 100).toFixed(2)
        },
        init () {
            this.loading = true
            this.time = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
            let arr = this.list.map(v => `/actuator/metrics/${v.name}`)
            let reqs = []
            let list = this.list
            for (let i = 0; i < arr.length; i++) {
                reqs.push(axios.get(arr[i]))
            }
            axios.all(reqs).then(axios.spread((...res) => {
                if (res) {
                    for (let i = 0; i < list.length; i++) {
                        let val = res[i].data.measurements[0].value
                        list[i].value = list[i].unit === '%' ? this.convert(val) : (list[i].unit === '' ? moment(val * 1000).format('YYYY-MM-DD HH:mm:ss') : val)
                    }
                    this.loading = false
                }
            })).catch(err => {
                console.log(err)
                this.loading = false
            })
        }
    }
}
</script>

<style lang="less">
.server-info {
    .server-info-top {
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
