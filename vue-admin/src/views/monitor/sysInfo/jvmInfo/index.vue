<template>
<div class="jvm box-wrap">
    <div class="jvm-top">
        <i class="el-icon-success"></i>
        <span class="tips">数据获取时间 {{time}}</span>
        <el-button type="text" v-preventReClick="2000" @click="init(14)">点击刷新</el-button>
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
                { unit: 'MB', value: null, type: '', name: 'jvm.memory.max', desc: 'JVM 最大内存' },
                { unit: 'MB', value: null, type: '', name: 'jvm.memory.committed', desc: 'JVM 可用内存' },
                { unit: 'MB', value: null, type: '', name: 'jvm.memory.used', desc: 'JVM 已用内存' },
                { unit: 'MB', value: null, type: 'info', name: 'jvm.buffer.memory.used', desc: 'JVM 缓冲区已用内存' },
                { unit: '个', value: null, type: 'info', name: 'jvm.buffer.count', desc: '当前缓冲区数量' },
                { unit: '个', value: null, type: 'success', name: 'jvm.threads.daemon', desc: 'JVM 守护线程数量' },
                { unit: '个', value: null, type: 'success', name: 'jvm.threads.live', desc: 'JVM 当前活跃线程数量' },
                { unit: '个', value: null, type: 'success', name: 'jvm.threads.peak', desc: 'JVM 峰值线程数量' },
                { unit: '个', value: null, type: 'warning', name: 'jvm.classes.loaded', desc: 'JVM 已加载 Class 数量' },
                { unit: '个', value: null, type: 'warning', name: 'jvm.classes.unloaded', desc: 'JVM 未加载 Class 数量' },
                { unit: 'MB', value: null, type: 'danger', name: 'jvm.gc.memory.allocated', desc: 'GC 时, 年轻代分配的内存空间' },
                { unit: 'MB', value: null, type: 'danger', name: 'jvm.gc.memory.promoted', desc: 'GC 时, 老年代分配的内存空间' },
                { unit: 'MB', value: null, type: 'danger', name: 'jvm.gc.max.data.size', desc: 'GC 时, 老年代的最大内存空间' },
                { unit: 'MB', value: null, type: 'danger', name: 'jvm.gc.live.data.size', desc: 'FullGC 时, 老年代的内存空间' }
            ]
        }
    },
    created () {
        this.init(14)
    },
    methods: {
        getTime (t) {
            return moment(t).format('YYYY-MM-DD HH:mm:ss')
        },
        convert (val) {
            return Number(val / 1048576).toFixed(3)
        },
        getpause () {
            axios.get('/actuator/metrics/jvm.gc.pause').then(res => {
                if (res.data) {
                    this.list.push(
                        { value: res.data.measurements[0].value, unit: '秒', desc: '系统启动以来GC 总耗时', name: 'jvm.gc.pause.totalTime', type: '' },
                        { value: res.data.measurements[1].value, unit: '次', desc: '系统启动以来GC 次数', name: 'jvm.gc.pause.count', type: '' }
                    )
                }
            })
        },
        init (num) {
            this.loading = true
            this.time = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
            let arr = this.list.map(v => `/actuator/metrics/${v.name}`)
            let reqs = []
            let list = this.list
            for (let i = 0; i < num; i++) {
                reqs.push(axios.get(arr[i]))
            }
            axios.all(reqs).then(axios.spread((...res) => {
                if (res) {
                    for (let i = 0; i < list.length; i++) {
                        let val = res[i].data.measurements[0].value
                        list[i].value = list[i].unit === 'MB' ? this.convert(val) : val
                    }
                    this.getpause()
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
.jvm {
    .jvm-top {
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
