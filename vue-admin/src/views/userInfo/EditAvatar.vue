<template>
<el-dialog class="edit-user-avatar" :append-to-body="true" :title="avatarInfo.title" :visible.sync="avatarInfo.show" width="680px" :close-on-click-modal="false">
    <el-tabs v-model="activeName">
        <el-tab-pane v-for="(item, i) in list" :key="i" :label="item.label" :name="`${i}`">
            <div class="img-wrap" v-for="(img, n) in item.imgs" :key="n" @click="handleSelectAvatar(img)">
                <i v-show="avatarInfo.avatar===img" class="el-icon-success"></i>
                <img class="img" :src="require(`@/assets/img/${img}`)" alt="">
            </div>
        </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="avatarInfo.show=false">取 消</el-button>
      <el-button type="primary" v-preventReClick="2000" @click="handleSave">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>
export default {
    name: 'EditAvatar',
    props: {
        avatarInfo: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            activeName: '0',
            list: [{
                    label: '后田花子',
                    imgs: ['default.jpg', '1d22f3e41d284f50b2c8fc32e0788698.jpeg',
                        '2dd7a2d09fa94bf8b5c52e5318868b4d9.jpg', '2dd7a2d09fa94bf8b5c52e5318868b4df.jpg',
                        '8f5b60ef00714a399ee544d331231820.jpeg', '17e420c250804efe904a09a33796d5a10.jpg',
                        '17e420c250804efe904a09a33796d5a16.jpg', '87d8194bc9834e9f8f0228e9e530beb1.jpeg',
                        '496b3ace787342f7954b7045b8b06804.jpeg', '595ba7b05f2e485eb50565a50cb6cc3c.jpeg',
                        '964e40b005724165b8cf772355796c8c.jpeg', '5997fedcc7bd4cffbd350b40d1b5b987.jpg',
                        '5997fedcc7bd4cffbd350b40d1b5b9824.jpg', 'a3b10296862e40edb811418d64455d00.jpeg',
                        'a43456282d684e0b9319cf332f8ac468.jpeg', 'bba284ac05b041a8b8b0d1927868d5c9x.jpg',
                        'c7c4ee7be3eb4e73a19887dc713505145.jpg', 'ff698bb2d25c4d218b3256b46c706ece.jpeg'
                    ]
                },
                {
                    label: '阿里系',
                    imgs: ['cnrhVkzwxjPwAaCfPbdc.png', 'BiazfanxmamNRoxxVxka.png', 'gaOngJwsRYRaVAuXXcmB.png',
                        'WhxKECPNujWoWEFNdnJE.png', 'ubnKSIfAJTxIgXOKlciN.png', 'jZUIxmJycoymBprLOUbT.png'
                    ]
                },
                {
                    label: '脸萌',
                    imgs: ['19034103295190235.jpg', '20180414165920.jpg', '20180414170003.jpg',
                        '20180414165927.jpg', '20180414165754.jpg', '20180414165815.jpg',
                        '20180414165821.jpg', '20180414165827.jpg', '20180414165834.jpg',
                        '20180414165840.jpg', '20180414165846.jpg', '20180414165855.jpg',
                        '20180414165909.jpg', '20180414165914.jpg', '20180414165936.jpg',
                        '20180414165942.jpg', '20180414165947.jpg', '20180414165955.jpg'
                    ]
                }
            ]
        }
    },
    methods: {
        handleSelectAvatar (img) {
            this.avatarInfo.avatar = img
        },
        handleSave () {
            this.avatarInfo.avatar ? this.$emit('save') : this.$message.error('请先选择头像')
        }
    }
}
</script>

<style lang="less">
.edit-user-avatar {
    .el-tab-pane {
        display: flex;
        flex-wrap: wrap;
        min-height: 330px;
    }
    .img-wrap {
        width: 96px;
        height: 96px;
        transition: 0.3;
        margin: 5px;
        cursor: pointer;
        position: relative;
        .el-icon-success {
            position: absolute;
            right: 3px;
            top: 2px;
            font-size: 20px;
            color: #2680EB;
        }
        .img {
            height: 96px;
            width: 96px;
            border: none;
            border-radius: 2px;
        }
        &:hover {
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
    }
}
</style>
