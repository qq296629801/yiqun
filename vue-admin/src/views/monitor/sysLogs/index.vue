<template>
<div class="sys-log box-wrap">
    <query-box :queryForm="queryForm" @search="handleSearch(true)" @reset="reset"></query-box>
    <table-list :tableData="tableData" @flash="handleSearch"></table-list>
</div>
</template>

<script>
import moment from 'moment'
import TableList from './TableList'
import QueryBox from './QueryBox'
export default {
    name: 'SysLogs',
    components: {
        QueryBox,
        TableList
    },
    data () {
        return {
            tableData: {
                total: 0,
                pageSize: 10,
                currentPage: 1,
                loading: false,
                isSearch: false,
                rows: []
            },
            queryForm: {
                username: null,
                operation: null,
                location: null,
                time: []
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        handleSearch (flag) {
            if (flag) {
                this.tableData.currentPage = 1
            }
            this.tableData.isSearch = true
            this.init()
        },
        init () {
            const {
                username,
                operation,
                location,
                time
            } = this.queryForm
            const {
                pageSize,
                currentPage
            } = this.tableData
            const params = {
                username,
                operation,
                location,
                createTimeFrom: time && time[0] && moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
                createTimeTo: time && time[1] && moment(time[1]).format('YYYY-MM-DD HH:mm:ss'),
                pageSize: pageSize,
                pageNum: currentPage
            }
            this.tableData.loading = true
            this.$get('/log', params).then(res => {
                if (res) {
                    const { rows, total } = res
                    this.tableData.rows = rows
                    this.tableData.total = total
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        },
        reset () {
            this.queryForm = {
                username: null,
                operation: null,
                location: null,
                time: []
            }
            this.init()
        }
    }
}
</script>
