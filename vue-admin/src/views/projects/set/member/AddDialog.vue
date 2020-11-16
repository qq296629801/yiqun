<template>
<el-dialog top="20px" :append-to-body="true" :close-on-click-modal="false" class="add-dialog" :title="addForm.title" :visible.sync="addForm.show" width="1050px">
    <div class="box-top">
        <el-form>
            <el-form-item label="用户名">
                <el-input clearable placeholder="请输入用户名" v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-select ref="treeSelect" popper-class="deptSelectDown" clearable @clear="handleClear" v-model="form.deptId" placeholder="请选择部门">
                    <el-option
                        :label="deptLabel"
                        :value="form.deptId">
                        <el-tree
                            class="scroll-bar tree-box"
                            ref="deptTree"
                            node-key="id"
                            :check-strictly="true"
                            :props="labelProp"
                            :data="depList"
                            @node-click="nodeClick">
                        </el-tree>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker clearable v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-preventReClick="2000" @click="search">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="box-table" style="padding-bottom:0;">
        <el-table :row-key="getRowKeys" :data="tableData" tooltip-effect="dark" v-loading="loading" @select-all="selectedChange" @select="selectedChange" height="400px">
            <template slot="empty">
                <no-data :types="isSearch">
                    <span>暂无数据</span>
                </no-data>
            </template>
            <el-table-column type="selection" width="55" :selectable="selectable" :reserve-selection="true"></el-table-column>
            <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="realname" label="真实姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="部门" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <template v-if="scope.row.status==='0'">锁定</template>
                    <template v-else-if="scope.row.status==='1'">有效</template>
                    <template v-else>--</template>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        </el-table>
    </div>
    <div style="text-align:right" v-if="tableData.length>0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addForm.show=false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
import moment from 'moment'
import NoData from '@/components/NoData'
export default {
    name: 'AddMember',
    props: {
        addForm: {
            type: Object,
            required: true
        }
    },
    components: { NoData },
    data () {
        const groupInfo = JSON.parse(localStorage.getItem('groupInfo'))
        return {
            getRowKeys (row) {
                return row.username
            },
            groupInfo,
            selected: [],
            depList: [],
            loading: false,
            isSearch: false,
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            form: {
                username: null,
                time: [],
                deptId: null
            },
            labelProp: {
                label: 'title'
            },
            deptLabel: ''
        }
    },
    created () {
        this.init()
        this.getDeps()
    },
    methods: {
        nodeClick (target, node) {
            this.form.deptId = target.id
            this.deptLabel = target.title
            this.$refs.treeSelect.blur()
        },
        search () {
            this.isSearch = true
            this.currentPage = 1
            this.init()
        },
        init () {
            const { username, deptId, time } = this.form
            const params = {
                username,
                createTimeFrom: time[0] && moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
                createTimeTo: time[1] && moment(time[1]).format('YYYY-MM-DD HH:mm:ss'),
                deptId,
                pageSize: this.pageSize,
                pageNum: this.currentPage
            }
            this.loading = true
            this.$get('/user', params).then(res => {
                if (res) {
                    const { rows, total } = res
                    this.total = total
                    rows.length > 0 ? this.getAllMembers(rows) : this.tableData = rows
                }
            }).finally(() => {
                this.loading = false
            })
        },
        getAllMembers (rows) {
            const params = {
                groupId: this.groupInfo.id
            }
            this.$post('/group/queryUsers', params).then(res => {
                if (res) {
                    for (let i = 0; i < rows.length; i++) {
                        for (let n = 0; n < res.rows.length; n++) {
                            if (rows[i].username === res.rows[n].userName) {
                                rows[i].disabled = true
                            }
                        }
                    }
                    this.tableData = rows
                }
            })
        },
        selectable (row) {
            return !row.disabled
        },
        selectedChange (val) {
            this.selected = val
        },
        getDeps () {
            this.$get('/dept', {}).then(res => {
                if (res) {
                    const { rows: { children } } = res
                    this.depList = children
                }
            })
        },
        handleClear () {
            this.deptLabel = null
        },
        reset () {
            this.form = {
                username: null,
                time: [],
                deptId: null
            }
            this.deptLabel = null
            this.isSearch = false
            this.selected = []
            this.init()
        },
        handleSave () {
            if (this.selected.length > 0) {
                // this.$emit('save', this.selected.map(v => v.username))
                this.$emit('save', this.selected.map(v => v.operId))
            } else {
                this.$message.error('请先选择成员')
            }
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.init()
        },
        handleSizeChange (val) {
            this.pageSize = val
            this.init()
        }
    }
}
</script>
