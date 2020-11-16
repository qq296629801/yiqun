<template>
    <div class="user-infoset">
        <el-card shadow="never">
            <div slot="header">
                <span class="t-b-name">基本信息</span>
                <el-button class="btn" type="text" @click="handleEdit"><i class="iconfont icon-bianji"></i>{{isEdit?'保存':'修改'}}</el-button>
                <!-- <el-button type="text" @click="updateTX = true">{{isEdit?'上传头像':''}}</el-button> -->
            </div>
            <el-form ref="form" :model="form" label-position="right" :rules="rules" label-width="82px" :hide-required-asterisk="true">
                <el-form-item label="用户名：" prop="username">
                    <span v-if="!isEdit">{{form.username}}</span>
                    <el-input readonly v-else clearable placeholder="请输入用户名" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名：" prop="realname">
                    <span v-if="!isEdit">{{form.realname}}</span>
                    <el-input v-else clearable placeholder="请输入真实姓名" v-model="form.realname"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="ssex" class="flex-form-item">
                    <span v-if="!isEdit">{{form.ssex==='0'?'男':form.ssex==='1'?'女':'保密'}}</span>
                    <el-radio-group v-else v-model="form.ssex">
                        <el-radio label="0">男</el-radio>
                        <el-radio label="1">女</el-radio>
                        <el-radio label="2">保密</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色：" prop="roleId">
                    <span v-if="!isEdit">{{form.roleName}}</span>
                    <el-select v-else v-model="form.roleId" @change="selectRole" multiple placeholder="请选择角色">
                        <el-option
                            v-for="(item, key) in roleList"
                            :key="key"
                            :label="item.roleName"
                            :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门：">
                    <span v-if="!isEdit">{{form.deptName}}</span>
                    <!-- <el-select v-else popper-class="deptSelectDown" clearable v-model="form.deptId" placeholder="请选择部门"> -->
                    <el-select ref="treeDepSelect" v-else popper-class="deptSelectDown" @clear="handleClear" clearable v-model="form.deptId" placeholder="请选择部门">
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
                <el-form-item label="状态：" prop="status" class="flex-form-item">
                    <span v-if="!isEdit">{{form.status==='0'?'锁定':'有效'}}</span>
                    <!-- {{form.status==='0'?'锁定':form.status==='1'?'有效':form.status==='2'?'未分配':'已注销'}} -->
                    <el-radio-group v-else v-model="form.status">
                        <el-radio label="0">锁定</el-radio>
                        <el-radio label="1">有效</el-radio>
                        <!-- <el-radio label="2">未分配</el-radio>
                        <el-radio label="3">已注销</el-radio> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="头像：" prop="avatar">
                    <img class="qunzhutx" :src="`${$location.origin}/${form.avatar}`" :onerror="defaultImg"/>
                    <div class="upload-warp" v-if="isEdit"><span class="upload-btn">上传</span><input style="opacity: 0;" type="file" accept="image/*" @change="handleSelectTx"/></div>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card shadow="never" class="clearFix">
            <div slot="header">
                <span class="t-b-name">删除用户</span>
            </div>
            <i class="iconfont icon-shanchuxiangmu"></i>
            <span class="text-shanchu">点击按钮删除用户，请谨慎操作！</span>
            <el-button class="btn" type="danger" plain @click="handleRemove(userInfo)">删除</el-button>
        </el-card>
        <el-card shadow="never" class="clearFix">
            <div slot="header">
                <span class="t-b-name">密码重置</span>
            </div>
            <i class="iconfont icon-zhuanrangxiangmu"></i>
            <span class="text-zhuanrang">点击按钮重置密码，请谨慎操作！</span>
            <el-button class="btn" type="warning" plain @click="handleReset(userInfo)">重置</el-button>
        </el-card>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import DefaultImg from '@/assets/img/default.jpg'
export default {
    name: 'InfoSet',
    data () {
        return {
            defaultImg: `this.src='${DefaultImg}'`,
            file: {},
            waitSubmitAvatar: '',
            imgFormData: '',
            labelProp: {
                label: 'title'
            },
            deptLabel: '',
            depList: [],
            roleList: [],
            password: '123456',
            form: {
                username: null,
                realname: null,
                roleId: [],
                deptId: null,
                status: null,
                ssex: null,
                roleName: null
            },
            isEdit: false,
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 50, message: '长度在 4 到 50 个字符', trigger: 'blur' }
                ],
                realname: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '真实姓名不能超过50个字符', trigger: 'blur' }
                ],
                roleId: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ],
                status: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                ssex: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters({
            userInfo: 'common/getUserInfo'
        })
    },
    mounted () {
        this.getDeps()
        if (!Object.keys(this.userInfo).length) {
            this.$router.push('/system/user')
        }
    },
    methods: {
        handleSelectTx (e) {
            // 上传之前可以过滤掉其他类型，很简单，加类型 accept="image/*"
            this.file = e.target.files[0]
            // this.waitSubmitAvatar = e.target.files[0].name 此时是客户机的地址，不用直接获取
            let formData = new FormData()
            formData.append('file', this.file)
            // file 是服务器的入参，这个接口只有一个入参就是文件类型
            this.$post('/file/upload', formData).then(res => {
                // 返回的是服务器后台的处理过的地址，dsadxzdasd.jpg ，因为客户上传文件名称可能是中文加乱码，所以服务器要处理。
                this.form.avatar = res
                //  复制给全局变量
            })
        },
        handleClear () {
            this.deptLabel = ''
            this.form.deptId = null
        },
        selectRole (val) {
            let result = []
            for (let i = 0; i < val.length; i++) {
                for (let k = 0; k < this.roleList.length; k++) {
                    if (+val[i] === +this.roleList[k].roleId) {
                        result.push(this.roleList[k].roleName)
                        this.form.roleName = result.toString()
                    }
                }
            }
        },
        nodeClick (target, node) {
            this.form.deptId = +target.id
            this.deptLabel = target.title
            this.$refs.treeDepSelect.blur()
        },
        getDeps () {
            this.form = { ...this.userInfo }
            // 获取部门树结构
            this.$get('/dept').then(res => {
                if (res) {
                    this.depList = res.rows.children
                    this.getInitDeptLabel(this.depList, this.userInfo.deptId)
                }
            })
            // 获取角色列表
            this.$get('/role').then(res => {
                if (res) {
                    this.roleList = res.rows
                }
            })
        },
        getInitDeptLabel (data, deptId) {
            for (let i = 0, l = data.length; i < l; i++) {
                if (+data[i].id === deptId) {
                    this.deptLabel = data[i].text
                }
                if (data[i].children) {
                    this.getInitDeptLabel(data[i].children)
                }
            }
        },
        handleRemove (item) {
            this.$confirm('确定要删除该用户吗？', '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                type: 'warning'
            }).then(() => {
                this.handleRemoveConfirm(item.userId)
            }).catch(() => {})
        },
        handleRemoveConfirm (param) {
            this.$delete('/user', param).then(res => {
                if (res) {
                    this.$message.success('删除成功')
                    this.$router.push('/system/user')
                }
            })
        },
        handleReset (item) {
            this.$confirm(`确定要重置<span>[${item.username}]</span>的用户密码吗？点击确定后，该用户的密码将重置为<span style="color: red">123456</span>`, '提示', {
                confirmButtonText: '确 定',
                cancelButtonText: '取 消',
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                this.handleResetConfirm(item.username)
            }).catch(() => {})
        },
        handleResetConfirm (param) {
            this.$put('/user/password/reset', { usernames: param }).then(res => {
                if (res) {
                    this.$message.success('重置成功')
                }
            })
        },
        // init () {
        //     this.$post('/project/queryById', { projectId: this.projectId }).then(res => {
        //         if (res) {
        //             this.item = res
        //         }
        //     })
        // },
        updated () {
            let params = {
                username: this.form.username,
                realname: this.form.realname,
                roleId: this.form.roleId,
                deptId: this.form.deptId && this.form.deptId.toString(),
                status: this.form.status,
                ssex: this.form.ssex,
                userId: this.form.userId,
                avatar: this.form.avatar
            }
            params.deptId = params.deptId || '0'
            params.roleId = params.roleId.join(',')
            this.$put('/user', params).then(res => {
                if (res) {
                    this.$message.success('保存成功')
                    this.isEdit = false
                    this.form.deptName = this.deptLabel
                }
            })
        },
        handleEdit () {
            if (this.form.roleId instanceof Array === false && this.form.roleId) {
                this.form.roleId = this.form.roleId.split(',').map(v => +v)
            }
            if (this.isEdit) {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.updated()
                    } else {
                        return false
                    }
                })
            } else {
                this.isEdit = true
            }
        }
    }
}
</script>
<style lang="less">
    .user-infoset {
        font-family: 'PingFangSC-Regular';
        .qunzhutx {
            width: 178px;
            height: 178px;
        }
        .is-plain {
            background: #fff;
        }
        .flex-form-item {
            display: flex;
            align-items: center;
            .el-form-item__content {
                margin-left: 0 !important;
            }
        }
        .el-button {
            min-width: inherit !important;
        }
        .el-card {
            border: 0;
            margin-bottom: 16px;
            .el-card__header {
                padding: 0;
                border-bottom: 0;
                & > div {
                    display: flex;
                    align-items: center;
                }
                .el-button {
                    span {
                        display: flex;
                        align-items: center;
                        .icon-bianji {
                            color: #3286C7;
                            margin: 0 4px 0 8px;
                        }
                    }
                }
            }
            .el-card__body {
                padding: 8px 13px 13px;
                .el-form-item {
                    margin-bottom: 16px !important;
                    .el-form-item__label {
                        color: rgba(51, 51, 51, .65);
                    }
                }
            }
        }
        .clearFix {
            border-radius: 0;
            .el-card__body {
                padding: 13px !important;
                display: flex;
                align-items: center;
            }
            .icon-shanchuxiangmu {
                color: #FF0000;
                font-size: 20px;
            }
            .icon-zhuanrangxiangmu {
                color: #FFA800;
                font-size: 20px;
            }
            .text-shanchu, .text-zhuanrang {
                display: inline-block;
                margin: 0 16px 0 9px;
                font-size: 14px;
            }
        }
    }
</style>
