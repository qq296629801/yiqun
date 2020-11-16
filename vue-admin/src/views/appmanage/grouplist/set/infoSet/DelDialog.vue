<template>
<el-dialog :close-on-press-escape="false" :append-to-body="true" :title="delData.title" :visible.sync="delData.show" width="418px" :close-on-click-modal="false">
    <el-form ref="form" :model="delData">
        <el-form-item class="check-delete">确认删除群后，无法撤销或恢复</el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="delData.show=false">取 消</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'DelDialog',
    props: {
        delData: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleSave () {
            this.$emit('save')
        }
    }
}
</script>
<style lang="less" scoped>
.check-delete {
    display: inline-block;
    color: red;
    margin: 0 5px;
}
</style>
