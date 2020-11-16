<template>
<div class="box-top">
    <el-form @submit.native.prevent>
        <el-form-item>
            <el-input clearable placeholder="请输入操作人" @clear="$emit('search')" @keyup.enter.native="$emit('search')" v-model="queryForm.username">
                <i @click="$emit('search')" slot="prefix" class="iconfont icon-sousuo"></i>
            </el-input>
            <!-- <el-select v-model="queryForm.username" placeholder="请选择操作人">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> -->
        </el-form-item>
        <el-form-item>
            <el-input clearable placeholder="请输入操作描述" @clear="$emit('search')" @keyup.enter.native="$emit('search')" v-model="queryForm.operation"></el-input>
        </el-form-item>
        <el-form-item>
            <!-- <el-date-picker clearable v-model="queryForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
            <el-date-picker :unlink-panels="true" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable v-model="queryForm.time" align="right" type="daterange" placeholder="选择日期" :picker-options="pickerOptions">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" v-preventReClick="2000" @click="$emit('search')">查询</el-button>
            <el-button @click="$emit('reset')">重置</el-button>
            <!-- class="text-button" type="text" -->
        </el-form-item>
    </el-form>
</div>
</template>

<script>
export default {
    name: 'ProjectsQuery',
    props: {
        queryForm: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            pickerOptions: {
                disabledDate (time) {
                    return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '12小时',
                    onClick (picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 12)
                        let arr = [date, new Date()]
                        picker.$emit('pick', arr)
                    }
                }, {
                    text: '一天',
                    onClick (picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        let arr = [date, new Date()]
                        picker.$emit('pick', arr)
                    }
                }, {
                    text: '三天',
                    onClick (picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 3)
                        let arr = [date, new Date()]
                        picker.$emit('pick', arr)
                    }
                }, {
                    text: '三个月',
                    onClick (picker) {
                        const date = new Date()
                        date.setMonth(date.getMonth() - 3)
                        let arr = [date, new Date()]
                        picker.$emit('pick', arr)
                    }
                }]
            }
        }
    }
}
</script>

<style lang="less">
    // .text-button {
    //     min-width: auto !important;
    //     margin-left: 0 !important;
    // }
</style>
