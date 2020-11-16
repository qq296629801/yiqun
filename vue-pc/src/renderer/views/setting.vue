<template>
<div>
    <Tabs>
        <TabPane label="快捷按键">
            <Form :label-width="80">
                <FormItem label="截取屏幕">
                    <Input clearable v-model="formItem.input" placeholder="Ctrl + Shift + A" style="width: 85%" disabled />
                </FormItem>
            </Form>
        </TabPane>
        <TabPane label="关于">
            <Form :label-width="80">
                <FormItem label="版本信息">
                    <Input clearable v-model="formItem.input" placeholder="易群" style="width: 85%" disabled />
                    <Button style="margin-top: 5px;" @click="detectionOfUpdate">检测更新</Button>
                </FormItem>
            </Form>
        </TabPane>
    </Tabs>
    <Modal v-model="modalPassEdit" title="修改密码" width="350">
        <Form :label-width="80" ref="fixPwd" :model="updateFrom" :rules="rules">
            <FormItem label="旧密码" prop="oldPassWord">
                <Input clearable type="password" v-model="updateFrom.oldPassWord" placeholder="请输入旧密码" style="width: 200px" />
            </FormItem>
            <FormItem label="新密码" prop="newPassWord">
                <Input clearable type="password" v-model="updateFrom.newPassWord" placeholder="请输入新密码" style="width: 200px" />
            </FormItem>
            <FormItem label="确认密码" prop="qurePassWord">
                <Input clearable type="password" v-model="updateFrom.qurePassWord" placeholder="请重复输入新密码" style="width: 200px" />
            </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="cancelUpdatePassWord">取消</Button>
            <Button type="primary" @click="updatePassWord">确定</Button>
        </div>
    </Modal>

    <Modal title="正在更新新版本,请稍候..." :value="dialogVisible" width="60%" @on-cancel="closeOnClickModal" :footer-hide="true" :closable="false">
        <div style="width:100%;height:20vh;line-height:20vh;text-align:center">
            <Progress style="width:200px;" status="success" :text-inside="true" :stroke-width="20" :percent="percentage"/>
        </div>
    </Modal>
</div>
</template>

<script>
import {
    ipcRenderer
} from 'electron'
export default {
    name: "setting",
    props: ['modalSetting', 'modalMine'],
    data() {
        return {
            dialogVisible: false,
            closeOnClickModal: false,
            percentage: 0,
            // user: window.sessionStorage.getItem('user'),
            user: this.$store.state.user,
            tabPosition: 'left',
            formItem: {
                input: '',
                select: '',
                checkbox: [],
            },
            modalPassEdit: false,
            updateFrom: {
                oldPassWord: '',
                newPassWord: '',
                qurePassWord: '',
            },
            url: '',
            myNickName: '',
            telephone: '',
            birthday: '',
            rules: {
                oldPassWord: [{
                    required: true,
                    message: '请输入旧密码',
                    trigger: 'blur'
                }],
                newPassWord: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                }],
                qurePassWord: [{
                    required: true,
                    message: '请重复输入新密码',
                    trigger: 'blur'
                }]
            }
        }
    },
    created() {},
    methods: {
        myLogout() {
            localStorage.removeItem('chatList')
            localStorage.removeItem('groupChatItem')
            localStorage.removeItem('friendChatItem')
            localStorage.removeItem('groupList')
            localStorage.removeItem('userItem')
            localStorage.removeItem('user')
            this.$router.push('/login')
        },
        updatePassWord() {
            this.$refs.fixPwd.validate((valid) => {
                if (valid) {
                    if (this.updateFrom.newPassWord !== this.updateFrom.qurePassWord) {
                        this.$Message.error('密码不一致');
                        return
                    }
                    this.$socket.updatePassword(this.user.id, this.user.userName, this.updateFrom.newPassWord, res => {
                        if (res.success) {
                            this.$store.state.modalMine = true
                            this.$Message.success('修改成功');
                        }
                    })
                }
            })
        },
        cancelUpdatePassWord() {
            this.modalPassEdit = false
            this.updateFrom.oldPassWord = ''
            this.updateFrom.newPassWord = ''
            this.updateFrom.qurePassWord = ''
        },
        detectionOfUpdate() {
            this.dialogVisible = true;
            ipcRenderer.send("checkForUpdate");
            ipcRenderer.on("message", (event, text) => {
                this.tips = text;
                alert(text)
            });
            ipcRenderer.on("downloadProgress", (event, progressObj) => {
                this.percentage = progressObj.percent || 0;
            });
            ipcRenderer.on("isUpdateNow", () => {
                ipcRenderer.send("isUpdateNow");
            });
        }
    }
}
</script>

<style scoped>

</style>
