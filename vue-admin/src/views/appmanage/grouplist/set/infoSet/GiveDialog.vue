<template>
<el-dialog :close-on-press-escape="false" :append-to-body="true" :title="giveData.title" :visible.sync="giveData.show" width="418px" :close-on-click-modal="false">
    <el-form ref="form" :model="giveData" :rules="rules">
        <el-form-item>确认转让群后，无法撤销或恢复。</el-form-item>
        <el-form-item label="用户名" prop="value">
            <el-select class="give-data-select" v-model="giveData.value" filterable clearable placeholder="请选择用户名">
                <el-option v-for="(item, i) in giveData.list" :key="i" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="giveData.show=false">取 消</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'GiveDialog',
    props: {
        giveData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            rules: {
                value: [
                    {
                        required: true,
                        message: '请选择用户名',
                        trigger: 'changge'
                    }
                ]
            }
        }
    },
    methods: {
        handleSave (flag) {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$emit('save')
                } else {
                    return false
                }
            })
        }
    }
}
</script>
<style lang="less">
    .give-data-select {
        width: 100%;
        .el-input {
            width: 100% !important;
        }
    }
</style>
