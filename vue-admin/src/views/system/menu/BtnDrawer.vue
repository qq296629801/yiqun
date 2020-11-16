<template>
<el-drawer :wrapperClosable="false" :title="addFormBtn.title" :visible.sync="addFormBtn.show">
    <el-form ref="ruleBtnForm" :model="addFormBtn.form" :rules="rulesBtn" label-width="100px">
        <el-form-item label="按钮名称" prop="menuName">
            <el-input clearable placeholder="请输入按钮名称" v-model="addFormBtn.form.menuName"></el-input>
        </el-form-item>
        <el-form-item label="相关权限">
            <el-input clearable placeholder="请输入相关权限" v-model="addFormBtn.form.perms"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
            <el-tree
                class="scroll-bar tree-box"
                ref="menuTreeBtn"
                :props="labelProp"
                :check-strictly="true"
                :data="addFormBtn.treeDataNoBtn"
                node-key="id"
                show-checkbox
                @check-change="nodeClick">
            </el-tree>
        </el-form-item>
    </el-form>
    <div class="drawer__footer">
      <el-button @click="addFormBtn.show=false">取 消</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
    </div>
    <icons v-if="showIco.show" :showIco="showIco" @select="handleSelectIcon"></icons>
</el-drawer>
</template>

<script>
import Icons from './Icons'
export default {
    name: 'BtnDrawer',
    props: {
        addFormBtn: {
            type: Object,
            required: true
        }
    },
    components: {
        Icons
    },
    data () {
        return {
            showIco: {
                show: false,
                title: null,
                value: null
            },
            labelProp: {
                label: 'title'
            },
            rulesBtn: {
                menuName: [
                    { required: true, message: '请输入按钮名称', trigger: 'blur' }
                ]
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.$refs.menuTreeBtn.setCheckedKeys([this.addFormBtn.form.parentId])
        })
    },
    methods: {
        showIcon () {
            this.showIco = {
                show: true,
                title: '图标库',
                value: this.addFormBtn.form.icon
            }
        },
        handleSave () {
            this.$refs['ruleBtnForm'].validate((valid) => {
                if (valid) {
                    if (!this.$refs.menuTreeBtn.getCheckedKeys().length) {
                        this.$message.error('请选择上级菜单')
                        return false
                    }
                    this.$emit('save')
                } else {
                    return false
                }
            })
        },
        handleSelectIcon () {
            this.$set(this.addFormBtn.form, 'icon', this.showIco.value)
            this.showIco.show = false
        },
        nodeClick (data, checked) {
            if (checked) {
                this.addFormBtn.form.parentId = data.id
                this.$refs.menuTreeBtn.setCheckedKeys([data.id])
            }
        }
    }
}
</script>
