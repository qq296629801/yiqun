<template>
<div class="table-wrap">
    <div class="box-table" style="padding-bottom:0">
        <el-table
            height="100%"
            v-loading="tableData.loading"
            :data="tableData.rows"
            tooltip-effect="dark"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: ''}"
            @selection-change="handleSelected"
            @sort-change="tableSortChange"
            :default-sort="tableSortCondition">
            <template slot="empty">
                <no-data :types="tableData.isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column fixed type="selection" width="55"></el-table-column>
            <el-table-column fixed prop="text" label="菜单名称" show-overflow-tooltip min-width="150"></el-table-column>
            <el-table-column prop="icon" label="图标" width="60" show-overflow-tooltip>
                <template slot-scope="scope"><i :class="`menuTableIcon ${scope.row.icon}`"></i></template>
            </el-table-column>
            <el-table-column
                prop="type"
                column-key="type"
                :filters="[
                    {text: '菜单', value: '0'},
                    {text: '按钮', value: '1'}
                ]"
                label="类型"
                :filter-method="filterHandler"
                show-overflow-tooltip
                width="75">
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.type === '0' ? 'primary' : 'danger'"
                    disable-transitions>{{scope.row.type==='0'?'菜单':'按钮'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="path" label="地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="component" label="组件名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="permission" label="权限" show-overflow-tooltip></el-table-column>
            <el-table-column prop="order" label="排序" width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip sortable min-width="160"></el-table-column>
            <el-table-column prop="modifyTime" label="修改时间" show-overflow-tooltip sortable min-width="160"></el-table-column>
            <el-table-column fixed="right" label="操作" width="60">
                <template slot-scope="scope">
                    <el-button v-hasPermission="'menu:update'" @click="$emit(scope.row.type === '0'?'addMenu':'addBtn', false, scope.row)" type="text">修改</el-button>
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
        filterHandler (value, row, column) {
            const property = column['property']
            return row[property] === value
        },
        handleCurrentChange (val) {
            this.tableData.currentPage = val
            this.$emit('flash')
        },
        handleSizeChange (val) {
            this.tableData.pageSize = val
            this.$emit('flash')
        },
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
