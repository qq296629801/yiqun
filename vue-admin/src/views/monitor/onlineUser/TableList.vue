<template>
    <div class="box-table table-wrap" style="padding-bottom: 0">
        <el-table :data="tableData.rows" height="100%" tooltip-effect="dark" v-loading="tableData.loading">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column label="用户名" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.username }}
                    <el-tag v-if="username===scope.row.username" type="danger">current</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="loginTime" label="登录时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ip" label="登录IP" show-overflow-tooltip></el-table-column>
            <el-table-column prop="loginAddress" label="登录地点" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-hasPermission="'user:kickout'" @click="kickout(scope.row)" type="text">踢出</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import NoData from '@/components/NoData'
export default {
    name: 'ProjectsTable',
    components: { NoData },
    props: {
        tableData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            username: JSON.parse(localStorage.getItem('USER')).username
        }
    },
    methods: {
        kickout (item) {
            console.log(item)
            const { id, username } = item
            this.$confirm('该用户将会退出登录状态，确定要踢出该用户吗？', '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                type: 'warning'
            }).then(() => {
                this.$delete('/kickout', id).then(res => {
                    if (res) {
                        this.$message.success('踢出成功')
                        if (this.username === username) {
                            localStorage.clear()
                            this.$router.push('/login')
                        } else {
                            this.$emit('flash')
                        }
                    }
                })
            }).catch(() => {})
        }
    }
}
</script>
