<template>
<div class="online-user box-wrap">
    <el-form @submit.native.prevent>
        <el-form-item>
            <el-input
                @keyup.enter.native="handleSearch(true)"
                @clear="handleSearch(true)"
                placeholder="请输入用户名"
                clearable
                v-model="queryForm.name">
                <i @click="handleSearch(true)" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
        </el-form-item>
    </el-form>
    <table-list :tableData="tableData" @flash="handleSearch"></table-list>
</div>
</template>

<script>
import TableList from './TableList'
export default {
    name: 'OnlineUser',
    components: {
        TableList
    },
    data () {
        return {
            tableData: {
                loading: false,
                isSearch: false,
                rows: []
            },
            queryForm: {
                name: null
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        handleSearch (flag) {
            this.tableData.currentPage = 1
            if (flag) {
                this.tableData.isSearch = true
            }
            this.init()
        },
        init () {
            const {
                name
            } = this.queryForm
            const params = {
                username: name
            }
            this.tableData.loading = true
            this.$get('/online', params).then(res => {
                if (res) {
                    this.tableData.rows = res
                }
            }).finally(() => {
                this.tableData.loading = false
            })
        }
    }
}
</script>
