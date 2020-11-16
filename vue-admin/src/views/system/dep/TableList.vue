<template>
<div class="table-wrap">
    <div class="box-table" style="padding-bottom:0">
        <el-table
            height="100%"
            @sort-change="tableSortChange"
            :default-sort="tableSortCondition"
            :data="tableData.rows"
            v-loading="tableData.loading"
            tooltip-effect="dark"
            @selection-change="handleSelected"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: ''}">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="text" label="部门名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="modifyTime" label="修改时间" show-overflow-tooltip sortable></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button v-hasPermission="'dept:update'" @click="$emit('add', scope.row)" type="text">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
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
    computed: {
        ...mapGetters({
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
