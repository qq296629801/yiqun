<template>
<div class="project-table table-wrap">
    <div class="box-table">
        <el-table height="100%" :data="tableData.rows" tooltip-effect="dark" v-loading="tableData.loading" @sort-change="tableSortChange" @selection-change="handleSelected" :default-sort="tableSortCondition">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="id" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="电话" show-overflow-tooltip></el-table-column>
            <el-table-column prop="operuser" label="创建人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="opertime" label="创建时间" min-width="130" show-overflow-tooltip sortable></el-table-column>
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
    components: { NoData },
    props: {
        tableData: {
            type: Object,
            required: true
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
        handleSelected (val) {
            this.$emit('select', val)
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
