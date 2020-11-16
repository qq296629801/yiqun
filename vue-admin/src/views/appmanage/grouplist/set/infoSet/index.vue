<template>
    <div class="project-infoset">
        <el-card shadow="never" class="basic-infoset">
            <div slot="header">
                <span class="t-b-name">基本信息</span>
                <el-button class="btn" type="text" @click="handleEdit"><i class="iconfont icon-bianji"></i>{{isEdit?'保存':'修改'}}</el-button>
            </div>
            <el-form ref="form" :model="item" :rules="rules" label-width="96px" :hide-required-asterisk="true">
                <el-form-item label="群名称：" prop="groupName">
                    <span v-if="!isEdit">{{item.groupName}}</span>
                    <el-input v-else clearable placeholder="请输群名称" v-model="item.groupName"></el-input>
                </el-form-item>
                <el-form-item label="群主：">{{item.operUser}}</el-form-item>
                <el-form-item label="头像：">
                    <img class="qunzhutx" :src="`${$location.origin}/${item.avatar}`" :onerror="defaultImg"/>
                    <div class="upload-warp" v-if="isEdit"><span class="upload-btn">上传</span><input style="opacity: 0;" type="file" accept="image/*" @change="handleSelectTx"/></div>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card shadow="never" class="clearFix">
            <div slot="header">
                <span class="t-b-name">删除群</span>
            </div>
            <i class="iconfont icon-shanchuxiangmu"></i>
            <span class="text-shanchu">群删除后就再也不可恢复了，请谨慎操作！</span>
            <el-button class="btn" type="danger" plain @click="handleDel">删除</el-button>
        </el-card>
        <el-card shadow="never" class="clearFix">
            <div slot="header">
                <span class="t-b-name">转让群</span>
            </div>
            <i class="iconfont icon-zhuanrangxiangmu"></i>
            <span class="text-zhuanrang">群转让后就再也不可恢复了，请谨慎操作！</span>
            <el-button class="btn" type="warning" plain @click="handleGive">转让</el-button>
        </el-card>
        <give-dialog v-if="giveData.show" :giveData="giveData" @save="handleGiveSave"></give-dialog>
        <del-dialog v-if="delData.show" :delData="delData" @save="handleDelSave"></del-dialog>
    </div>
</template>
<script>
import GiveDialog from './GiveDialog'
import DelDialog from './DelDialog'
import DefaultImg from '@/assets/img/default.jpg'
export default {
    name: 'InfoSet',
    components: { GiveDialog, DelDialog },
    data () {
        const group = JSON.parse(localStorage.getItem('groupInfo'))
        return {
            defaultImg: `this.src='${DefaultImg}'`,
            file: '',
            username: JSON.parse(localStorage.getItem('USER')).username,
            giveData: {
                show: false,
                title: '转让群',
                value: '',
                list: []
            },
            delData: {
                show: false,
                title: '删除群',
                value: ''
            },
            item: group,
            isEdit: false,
            rules: {
                groupName: [
                    {
                        required: true,
                        message: '请输入群名称',
                        trigger: 'blur'
                    }
                ]
            }
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
                this.item.avatar = res
                //  复制给全局变量
            })
        },
        handleDel () {
            this.delData.show = true
            this.delData.value = this.item.projectName
        },
        handleGive () {
            this.getGiveList()
        },
        handleGiveSave () {
            const params = {
                toUserId: this.giveData.value,
                groupId: this.item.id
            }
            this.$post('/group/transferGroup', params).then(res => {
                if (res) {
                    this.giveData.show = false
                    this.$message.success('转让群成功')
                    this.$router.push('/grouplist')
                }
            })
        },
        getGiveList () {
            const params = {
                groupId: this.item.id
            }
            this.$post('/group/queryUsers', params).then(res => {
                if (res) {
                    this.giveData.list = res.filter(v => v.owner === false)
                    this.giveData.show = true
                }
            })
            // const params = {
            //     pageNum: -1,
            //     projectId: this.projectId
            // }
            // this.$post('/member/queryProjectMembers', params).then(res => {
            //     if (res) {
            //         this.giveData.list = res.rows.filter(v => v.username !== this.username)
            //         this.giveData.show = true
            //     }
            // })
        },
        handleDelSave () {
            const params = {
                groupId: this.item.id
            }
            this.$post('/group/delete', params).then(res => {
                if (res) {
                    this.$message.success('删除成功')
                    this.delData.show = false
                    this.$router.push('/grouplist')
                }
            })
        },
        updated () {
            const params = {
                groupId: this.item.id,
                groupName: this.item.groupName,
                avatar: this.item.avatar
            }
            this.$post('/group/update', params).then(res => {
                if (res) {
                    this.$message.success('保存成功')
                    this.isEdit = false
                }
            })
        },
        handleEdit () {
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
    .project-infoset {
        .basic-infoset {
            padding-bottom: 30px !important;
        }
        .qunzhutx {
            width: 178px;
            height: 178px;
        }
        font-family: 'PingFangSC-Regular';
        .el-button {
            min-width: inherit !important;
        }
        .is-plain {
            background: #fff;
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
                padding: 0 13px 8px 13px;
                .el-form-item {
                    margin-bottom: 5px;
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
