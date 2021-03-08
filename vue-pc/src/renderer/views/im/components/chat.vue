<template>
<div class="im-chat" v-if="chat.chatName">
    <div class="im-chat-top" v-if="chat">
        <span>{{ chat.chatName }}</span>
        <a href="javascript:;" @click="groupModal = true" class="pull-right menu" v-if="1 == chatType">
            <Icon type="ios-more"></Icon>
        </a>
    </div>
    <div class="im-chat-main">
        <div class="im-chat-main-left">
            <div class="im-chat-main-box messages" id="message-box">
                <ul>
                    <li v-for="(item, index) in msgList" :class="{'im-chat-mine': item.userName == user.userName}" :key="index">
                        <div class="im-chat-user">
                            <img class="message-img" @click.stop="handleToRemarks(item)" :src="`${$url}/${item.userName === user.userName?user.avatar:item.avatar}`" alt="">
                            <cite v-if="item.userName == user.userName">
                                <i>{{ item.operTime | dateFormat}}</i>
                                <i v-if="isShowNickName">{{item.groupNickName || item.nickName || item.nickname || item.remarkName || item.groupNickName || item.userName}}</i>
                            </cite>
                            <cite v-else>
                                <i v-if="isShowNickName">{{item.groupNickName || item.nickName || item.nickname || item.remarkName || item.groupNickName || item.userName}}</i>
                                <i>{{ item.operTime | dateFormat}}</i>
                            </cite>
                        </div>
                        <Dropdown trigger="contextMenu" placement="right">
                            <a href="javascript:void(0)">
                                <div v-if="item.msgType==0" class="im-chat-text">
                                    <pre v-html="showFacePng(item.msgContext)" v-on:click="openImageProxy($event)"></pre>
                                </div>
                                <!-- 图片 -->
                                <div v-if="item.msgType==1" class="im-chat-text">
                                    <img :src="`${$url}/${item.msgContext}`" width="100" v-viewer="{movable: false}" />
                                </div>
                                <!-- 语音 -->
                                <div v-if="item.msgType==3" @click="openVoice(item.content,item.timeLen)">
                                    <img src="../../../../../static/assets/voice.png" alt style="width: 25px;height: 25px;vertical-align:middle;" />
                                    <span>{{item.timeLen}}</span>
                                </div>
                                <!-- 位置 -->
                                <div v-if="item.msgType==4" @click="openMap(item.location_x,item.location_y)">
                                    <img :src="item.content" alt style="width: 200px;height:65px" />
                                    <p style="font-size: 11px;background:white">{{item.objectId}}</p>
                                </div>
                                <!-- gif -->
                                <div v-if="item.msgType==5">
                                    <img :src="item.content" alt style="width: 125px" />
                                </div>
                                <!-- 视频 -->
                                <div v-if="item.msgType==6">
                                    <video style="width: 120px;vertical-align:bottom;height:210px" controls="controls">
                                        <source :src="item.content" type="video/mp4" />
                                    </video>
                                </div>
                                <!-- 名片 -->
                                <div v-if="item.msgType==8" @click="openCard(item.objectId)" style="width:200px;background:white;height:67px">
                                    <div class="fileTop" style="padding:5px">
                                        <img class="fileImage" :src="item.avatar" alt style="width:35px;height: 35px;" />
                                        <span>{{item.content}}</span>
                                    </div>
                                    <p style="color:gray;font-size:11px;padding-left:5px">名片</p>
                                </div>
                                <!-- 文件 -->
                                <div v-if="item.msgType==9" class="im-chat-text" @click="openFile(item)">
                                    <div class="fileTop">
                                        <div class="fileMsg_div">
                                            <img class="fileImage" src="../../../../../static/assets/file.png" alt />
                                        </div>
                                        <div class="fileMsg_divShow" v-viewer="{movable: false}" style="display: none">
                                            <img class="fileImage" :src="item.content" alt />
                                        </div>
                                        <div class="fileMsg_div">
                                            <span style="display:inline-block;left:8px;width:125px;">{{item.fileName.split("/")[item.fileName.split("/").length-1]}}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 红包 -->
                                <div v-if="item.msgType==7" style="width:200px;height:80px;border-radius:8px">
                                    <div class="message-red-packet-left" style="background:orange">
									<div class="text">
									  <i slot="icon" class="iconfont icon-hongbao" style="color:red"></i>
									  <u-icon name="red-packet-fill" color="red" size="50"></u-icon>
									  <span class="packet">恭喜发财</span>
									</div>
									<div class="footer">红包</div>
									<div class="arrow-org" style="background:orange"></div>
								  </div>
                                </div>
                                <!-- 戳一戳 -->
                                <div v-if="item.msgType==84">[不支持请在手机端查看]</div>
                            </a>
                            <DropdownMenu slot="list" style="min-width: 0px;">
                                <DropdownItem v-if="item.userName == user.userName" style="margin-bottom: 0px; padding-left: 10px; min-height: 0px;">
                                    <span @click="handleRollback(item)">撤回</span>
                                </DropdownItem>
                                <DropdownItem style="margin-bottom: 0px; padding-left: 10px; min-height: 0px;">
                                    <span v-clipboard:copy="item.msgContext" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</span>
                                </DropdownItem>
                                <DropdownItem v-if="item.msgType==1" style="margin-bottom: 0px; padding-left: 10px; min-height: 0px;">
                                    <span @click="collectFunc(item)">收藏</span>
                                </DropdownItem>
                                <DropdownItem v-if="item.msgType!=7" style="margin-bottom: 0px; padding-left: 10px; min-height: 0px;">
                                    <span @click="showTransmit(item)">转发</span>
                                </DropdownItem>
                                <DropdownItem style="margin-bottom: 0px; padding-left: 10px; min-height: 0px;">
                                    <span @click="deleteFunc(item.id,index)">删除</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </li>
                </ul>
            </div>

            <div class="im-chat-footer">
                    <div class="im-chat-tool">
                        <Icon type="ios-crop-outline" @click="handleScreenshot"></Icon>
                        <Icon type="ios-happy-outline" @click="showFaceBox()"></Icon>
                        <Upload :action="action" name="file" :format="imgFormat" :data="tokenImg" :show-upload-list="false" :headers="headers" :max-size="5120" :with-credentials="true" :before-upload="beforeUpload" :on-progress="handleStart" :on-format-error="handleFormatError" :on-exceeded-size="handleImgMaxSize" :on-success="imgHandleSuccess" :on-error="handleError">
                            <Icon type="ios-image-outline"></Icon>
                        </Upload>
                        <Upload :action="action" name="file" :format="fileFormat" :data="tokenFile" :show-upload-list="false" :headers="headers" :max-size="102400" :with-credentials="true" :before-upload="beforeUpload" :on-progress="handleStart" :on-format-error="handleFormatError" :on-exceeded-size="handleFileMaxSize" :on-success="fileHandleSuccess" :on-error="handleError">
                            <Icon type="ios-folder-open-outline"></Icon>
                        </Upload>
                        <Faces v-show="showFace" @click="showFace = true" class="faces-box" @insertFace="insertFace"></Faces>
                        <Button size="small" class="history-message-btn" @click="getHistoryMessage()">聊天记录</Button>
                    </div>
                    <textarea v-on:paste="handlePaste" v-model="messageContent" class="textarea" @keyup.enter="mineSend()"></textarea>
                    <div class="im-chat-send">
                        <Button size="small" @click="mineSend()">发送</Button>
                    </div>
                </div>
            </div>

        <div v-if="chatType == 1" class="im-chat-users">
            <ul class="chat-user-list">
                <li v-for="(member,i) in members" @click="showUser(member)" :key="i">
                    <span class="im-chat-avatar">
                        <img :src="`${$url}/${member.avatar}`" alt />
                    </span>
                    {{member.groupNickName || member.remarkName}}
                </li>
            </ul>
        </div>

    </div>
    <Modal :footer-hide="true" :value="showDoc || showPdf || showVideo" :mask-closable="true" width="80%" @on-cancel="closePreviewClick">
        <div v-if="showDoc" class="dialog-body-content-base-style">
            <iframe frameborder="0" :src="'https://view.officeapps.live.com/op/view.aspx?src=' + this.fileUrl" width="100%"></iframe>
        </div>
        <div v-else-if="showPdf" class="dialog-body-content-base-style" style="justify-content: center; align-items: center">
            <embed :src="pdfUrl" style="width: 100%; height: 100%" />
        </div>
        <div v-else-if="showVideo" class="dialog-body-content-base-style" style="justify-content: center; align-items: center">
            <video-player class="video-player vjs-custom-skin" ref="positiveVideoPlayer" :playsinline="true" :options="positivePlayerOptions"></video-player>
        </div>
    </Modal>

    <Drawer title="群组信息" :closable="true" v-model="groupModal" class="history-message" width="35%" placement="right">
        <Form v-if="groupModal==true" :label-width="100" style="margin-top: 50px;">
            <FormItem label="群名称">
                <span>{{chat.chatName}}</span>
                <Icon type="md-color-filter" @click="updateGroupNameModel = true; newGroupName = chat.chatName" v-if="groupInfo.group.operUser == user.userName" />
            </FormItem>
            <FormItem label="群公告">
                <span>{{groupNotice?groupNotice:'暂无公告'}}</span>
                <Icon type="md-color-filter" @click="updateGroupNoticeModel = true; newGroupNotice = groupNotice" v-if="groupInfo.group.operUser == user.userName" />
            </FormItem>
            <FormItem label="群昵称">
                <span>{{groupInfo.groupUser.groupNickName}}</span>
                <Icon type="md-color-filter" @click="updateNickNameModel = true; newNickName = groupInfo.groupUser.groupNickName" />
            </FormItem>
            <FormItem label="显示昵称">
                <i-switch v-model="isShowNickName" @on-change="swichShowNickName" size="large">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
            <FormItem label="禁言">
                <i-switch v-model="isDisEnable" @on-change="swichsDisEnable" size="large">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
            <div style="width: 100%; text-align: center">
                <Button @click="clearGroupMsg" type="error" style="width: 85%;">清空聊天记录</Button>
                <div style="height: 10px;"></div>
                <Button @click="removeGroupUser" type="error" style="width: 85%;">删除并退出</Button>
            </div>
        </Form>
    </Drawer>

    <Modal v-model="updateGroupNoticeModel" title="设置群公告" @on-ok="updateNotice" @on-cancel="updateGroupNoticeModel = false">
        <Input clearable v-model="newGroupNotice" placeholder="请输入群公告" />
    </Modal>
    <Modal v-model="updateGroupNameModel" title="设置群名称" @on-ok="updateGroupName" @on-cancel="updateGroupNameModel = false">
        <Input clearable v-model="newGroupName" placeholder="请输入群名" />
    </Modal>
    <Modal v-model="updateNickNameModel" title="设置群昵称" @on-ok="updateGroupNick" @on-cancel="updateNickNameModel = false">
        <Input clearable v-model="newNickName" placeholder="请输入群昵称" />
    </Modal>

    <Modal v-model="transmitModal" :footer-hide="true" :closable="false" :styles="{height: '400px', overflow: 'scroll'}">
        <div slot="header" style="height: 20px">
            <div class="modelTitle" style="float: left">
                <p>转发</p>
            </div>
            <div class="modelBut" style="float: right">
                <Button size="small" type="success" @click="toTransmit">确定</Button>
                <Button size="small" type="error" @click="closeTransmit">取消</Button>
            </div>
        </div>
        <CheckboxGroup v-model="transmits" size="large">
            <Checkbox :label="index" :value="index" v-for="(transmit, index) in transmitList" :key="index" style="width: 100%; line-height: 45px;">
                <div class="group-box">
                    <ul class="user-list">
                        <li class="user">
                            <img :src="`${$url}/${transmit.avatar || transmit.imgUrl}`" style="width: 50px;" />
                            <b>{{ transmit.chatName }}</b>
                        </li>
                    </ul>
                </div>

            </Checkbox>
        </CheckboxGroup>
    </Modal>

    <Drawer title="个人信息" :closable="true" v-model="modal" class="history-message" width="30%" placement="right">
        <Form :model="formItem" :label-width="80">
            <FormItem label="消息免打扰">
                <i-switch v-model="formItem.switch" size="large">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
            <FormItem label="置顶聊天">
                <i-switch v-model="formItem.switch" size="large">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
        </Form>
    </Drawer>
    <Drawer title="聊天记录" :closable="true" v-model="showHistory" class="history-message" width="60%">
        <div class="im-chat-main">
            <div class="messages" id="his-chat-message">
                <ul>
                    <li v-for="(item,i) in hisMessageList" :key="i" :class="{'im-chat-mine': item.userName == user.userName}">
                        <div class="im-chat-user" id="historyMessageBox">
                            <img class="message-img" @click.stop="handleToRemarks(item)" :src="`${$url}/${item.userName === user.userName?user.avatar:item.avatar}`" alt="">
                            <cite v-if="item.userName == user.userName">
                                <i>{{ item.operTime | dateFormat}}</i>
                                {{item.remarkName || item.groupNickName || item.userName}}
                            </cite>
                            <cite v-else>
                                {{item.remarkName || item.groupNickName || item.userName}}
                                <i>{{ item.operTime | dateFormat}}</i>
                            </cite>
                        </div>
                        <div v-if="item.msgType==0" class="im-chat-text">
                            <pre v-html="showFacePng(item.msgContext)" v-on:click="openImageProxy($event)"></pre>
                        </div>
                        <!-- 图片 -->
                        <div v-if="item.msgType==1" class="im-chat-text">
                            <img :src="`${$url}/${item.msgContext}`" width="100" v-viewer="{movable: false}" />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <Page :total="count" size="small" show-total class="page" :page-size="pageSize" @on-change="getHistoryMessage" />
    </Drawer>

      <Modal v-model="clipboardModal" title="截图">
          <Layout>
            <Content>
               <img :src="clipboardSrc" style="width: auto;  
    height: auto;  
    max-width: 100%;  
    max-height: 100%;  " /> 
            </Content>
        </Layout>
      </Modal>

</div>
</template>

<script>
import Button from 'iview/src/components/button/button';
import Faces from './faces.vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
const {
    imageLoad,
    transform,
    ChatListUtils
} = require("../../../utils/ChatUtils");
const { ipcRenderer } = require('electron')
moment.locale('zh-cn');
export default {
    components: {
        Faces,
        Button
    },
    name: 'chat',
    computed: {
        chat: {
            get: function () {
                return this.$store.state.chat;
            },
            set: function (chat) {
                this.$store.commit('setChat', chat);
            }
        },
        chatType: {
            get: function () {
                return this.$store.state.chatType;
            },
            set: function (chatType) {
                this.$store.commit('setChatType', chatType);
            }
        },
        members: {
            get: function () {
                return this.$store.state.members;
            },
            set: function (members) {
                this.$store.commit('setMembers', members);
            }
        },
        msgList: {
            get: function () {
                return this.$store.state.msgList;
            },
            set: function (members) {
                this.$store.commit('setMsgList', members);
            }
        }
    },
    data() {
        return {
            clipboardSrc:'',
            clipboardModal:false,
            isDisEnable: false,
            messageStr: ['文字', '图片', '表情', '语音', '视频', '签到', '撤销', '发红包', '抢红包'],
            transmits: [],
            rightSelectId: '',
            transmitInfo: '',
            transmitList: [],
            transmitModal: false,
            isShowNickName: false,
            newGroupNotice: '',
            newGroupName: '',
            newNickName: '',
            updateGroupNoticeModel: false,
            updateGroupNameModel: false,
            updateNickNameModel: false,
            groupNotice: '',
            user: this.$store.state.user,
            packet: {},
            records: [],
            redPacketItem: {},
            message: {},
            emotionChoose: true,
            cusEmoticons: [],
            pageNum: 1,
            myUserId: window.sessionStorage.getItem('userId'),
            groupModal: false,
            formItem: {
                switch: ''
            },
            disabledSay: 0,
            host: '',
            count: 100,
            pageSize: 20,
            modal: false,
            showHistory: false,
            hisMessageList: [],
            // 保存各个聊天记录的map
            messageListMap: new Map(),
            messageContent: '',
            showFace: false,
            userList: [],
            imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
            fileFormat: ['doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'xls', 'xlsx', 'pdf', 'gif', 'exe', 'msi', 'swf', 'sql', 'apk', 'psd'],
            tokenImg: {
                access_token: '',
                type: 'image'
            },
            tokenFile: {
                access_token: '',
                type: 'file'
            },
            action: this.$uploadUrl,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            showMenus: false,
            noDataText: '没有更多了',
            isShowVoice: true, // 语音按钮
            // imageShow:false,
            // BigImage:"",
            voiceShow: false,

            showDoc: false,
            showPdf: false,
            showVideo: false,
            fileUrl: '',
            images: [],
            currentPage: 0, // pdf文件页码
            pageCount: 0, // pdf文件总页数
            pdfUrl: '',
            groupInfo: {},
            scale: 1.0,
            /**
             *播放器配置
             */
            positivePlayerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: '',
                    src: '' //视频url地址
                }],
                poster: '', //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true //全屏按钮
                },
                common: 'positivePlayer'
            }
        };
    },
    filters: {
        dateFormat(val) {
            return moment(Number(val)).calendar();
        }
    },
    methods: {
        handleScreenshot() {
            ipcRenderer.send('capture-screen')
        },
        // 禁言
        swichsDisEnable(status) {
            if (!this.groupInfo.group.groupMaster) {
                this.$Message.success('无权限操作');
                return;
            }
            this.$socket.groupDisEnable(this.chat.chatId, status ? 1 : 0, res => {
                let storeKey = 'isGroupDisEnable' + this.user.operId + '_' + this.chat.chatId;
                window.sessionStorage.setItem(storeKey, status)
            });
        },
        handleToRemarks(item) {
            console.warn('handleToRemarks', item)
        },
        getDisEnable() {
            let storeKey = 'isGroupDisEnable' + this.user.operId + '_' + this.chat.chatId;
            let store = window.sessionStorage.getItem(storeKey, this.isDisEnable)
            this.isDisEnable = store ? store : false
        },
        // 转发
        showTransmit(item) {
            this.transmitModal = true
            this.transmitInfo = item
            this.$socket.chats('', this.user.operId, (res) => {
                if (res.success) {
                    this.transmitList = res.chats
                }
            });
        },
        toTransmit() {
            for (let index of this.transmits) {
                let chatId = this.transmitList[index].chatId
                let action = this.transmitList[index].chatType == 1 ? 'send2Group' : 'send2Friend'
                this.$socket[action](chatId, this.user.operId, this.transmitInfo.msgContext, this.transmitInfo.msgType, res => {
                    if (res.success) {
                        this.$Message.success('转发成功');
                        this.$socket.createChatList(this.user.operId, chatId, this.transmitInfo.msgContext, this.transmitInfo.msgType, res => {})
                    }
                });
            }
            this.closeTransmit()
        },
        closeTransmit() {
            this.transmitModal = false
            this.transmitInfo = ''
            this.transmitList = []
            this.transmits = []
            // this.transmitGroup = []
            // this.friendsList = []
            // this.groupList = []
        },
        collectFunc({
            msgContext
        }) {
            this.$socket.addEmoticon(this.user.operId, msgContext, res => {
                if (res.success) {
                    this.$Message.success('添加成功');
                }
            });
        },
        deleteFunc(id, index) {
            this.msgList.splice(index, 1);
        },
        onCopy(e) {
            this.$Message.success('复制成功');
        },
        onError(e) {
            this.$Message.error('复制失败');
        },
        swichShowNickName(status) {
            this.isShowNickName = status;
            let storeKey = 'isShowNickName' + this.user.operId + '_' + this.chat.chatId;
            // this.$u.vuex(storeKey, this.isShowNickName)
            window.sessionStorage.setItem(storeKey, this.isShowNickName)
        },
        getShowNickName() {
            let storeKey = 'isShowNickName' + this.user.operId + '_' + this.chat.chatId;
            let store = window.sessionStorage.getItem(storeKey, this.isShowNickName)
            this.isShowNickName = store ? store : false
        },
        clearGroupMsg() {
            this.$socket.clearGroupMsg(this.user.operId, this.chat.chatId, res => {
                if (res.success) {
                    this.$message.success('成功');
                } else {
                    this.$message.error('失败');
                }
            });
        },
        removeGroupUser() {
            this.$socket.removeGroupUser([this.user.operId], this.chat.chatId, res => {
                if (res.success) {
                    self.$router.push({
                        path: '../index/chatBox',
                        params: {}
                    });
                }
            });
        },
        clearInfo() {
            this.groupModal = false
            this.updateGroupNoticeModel = false
            this.updateGroupNameModel = false
            this.updateNickNameModel = false
            this.newGroupNotice = ''
            this.newGroupName = ''
            this.newNickName = ''
        },
        updateGroupName() {
            this.$socket.updateGroupName(this.user.operId, this.chat.chatId, this.newGroupName, (res) => {
                this.groupInfo.group.groupName = this.newGroupName
                this.clearInfo();
                if (res.success) {
                    this.$Notice.success({
                        title: '修改成功',
                        duration: 1
                    });
                } else {
                    this.$Notice.error({
                        title: '修改成功',
                        duration: 1
                    });
                }
            })
        },
        updateNotice() {
            this.$socket.updateNotice(this.user.operId, this.chat.chatId, this.newGroupNotice, (res) => {
                this.groupNotice = this.newGroupNotice
                this.clearInfo();
                if (res.success) {
                    this.$Notice.success({
                        title: '修改成功',
                        duration: 1
                    });
                } else {
                    this.$Notice.error({
                        title: '修改成功',
                        duration: 1
                    });
                }
            })
        },
        updateGroupNick() {
            this.$socket.updateGroupNick(this.user.operId, this.chat.chatId, this.newNickName, (res) => {
                this.groupInfo.groupUser.groupNickName = this.newNickName
                this.clearInfo();
                if (res.success) {
                    this.$Notice.success({
                        title: '修改成功',
                        duration: 1
                    });
                } else {
                    this.$Notice.error({
                        title: '修改成功',
                        duration: 1
                    });
                }
            })
        },
        getGroupInfo() {
            if (this.chatType === 1) {
                this.$socket.queryGroupUser(this.user.operId, this.chat.chatId, res => {
                    this.getShowNickName();
                    this.getDisEnable();
                    this.groupInfo = {
                        groupUser: res.groupUser,
                        group: res.group
                    }
                })
            }
        },
        openChat() {
            this.$socket.openChat(this.chat.chatId, this.user.operId, this.chatType, res => {
                if (res.success) {
                    if (this.chatType === 1) {
                        if (res.groupUser === undefined) {
                            this.disabledSay = 1
                        } else {
                            this.disabledSay = res.groupUser.status
                        }
                    }
                }
            })
        },
        showFacePng(text) {
            return transform(text)
        },
        showUser: function (mem) {
            this.$store.commit('setMember', mem);
            this.$router.push({
                path: '/index/userBox',
                params: {}
            });
        },
        beforeUpload() {
            this.tokenImg = {
                access_token: '',
                type: 'image'
            };
            this.tokenFile = {
                access_token: '',
                type: 'file'
            };
            return new Promise(resolve => {
                this.$nextTick(function () {
                    resolve(true);
                });
            });
        },
        // 附件和图片点击展开
        openImageProxy: function (event) {
            let self = this;
            event.preventDefault();
            if (event.target.nodeName === 'IMG') {
                self.winControl.openURL(event.target.src);
            } else if (event.target.className === 'message-file') {
                self.winControl.openURL(event.target.href);
            }
        },
        // 错误提示
        openMessage(error) {
            this.$Message.error(error);
        },
        showFaceBox: function () {
            this.showFace = !this.showFace;
        },
        insertFace: function (item) {
            this.messageContent = this.messageContent + item;
            this.showFace = false;
        },
        handleStart() {
            this.$Loading.start();
        },
        handleFormatError(file) {
            this.$Message.warning('文件 ' + file.name + ' 格式不正确。');
        },
        handleImgMaxSize(file) {
            this.$Message.warning('图片 ' + file.name + ' 太大，不能超过 512K！');
        },
        handleFileMaxSize(file) {
            this.$Message.warning('文件 ' + file.name + ' 太大，不能超过 10M！');
        },
        imgHandleSuccess(res, file) {
            if (res.success) {
                this.send2(1, res.data)
            }
        },
        fileHandleSuccess(res, file) {},
        handleError: function () {
            this.$Loading.finish();
            this.$Message.error('上传错误！');
        },
        // 监听粘贴操作
        handlePaste(event) {
            if(process.env.IS_WEB){
                 this.$Message.error('is web');
                return;
            }
            const clipboard = require('electron').clipboard
            const image =  clipboard.readImage();
            console.log(image.toDataURL())

            this.clipboardModal = true;
            this.clipboardSrc = image.toDataURL()
            //console.log(image.toDataURL())  
            // const items = (event.clipboardData || window.clipboardData).items;
            // let file = null;
            // if (!items || items.length === 0) {
            //     this.$Message.error('登录异常信息');
            //     return;
            // }
            // // 搜索剪切板items
            // for (let i = 0; i < items.length; i++) {
            //     if (items[i].type.indexOf("image") !== -1) {
            //         file = items[i].getAsFile();
            //         break;
            //     }
            // }
            // if (file) {
            //     //图片上传
            //     const reader = new FileReader();
            //     reader.onload = event => {
            //         //const url = event.target.result
            //     };
            //     reader.readAsDataURL(file);
            //     let form = new FormData();
            //     form.append("file", file);
            //     form.append("type", this.type);
            //     this.$axios.post(`${this.$url}/file/upload`, form).then(res => {
            //         if (res.data.success) {
            //             this.send2(1, res.data.data)
            //         }
            //     })
            // }
        },
        // 本人发送信息
        mineSend() {
            let self = this;
            let content = self.messageContent;
            if (content !== '' && content !== '\n') {
                if (content.length > 2000) {
                    self.openMessage('不能超过2000个字符');
                } else {
                    self.send2(0, content)
                }
            }
        },
        historyResponse(msgList) {
            msgList.forEach(m => {
                if (m.msgType === 7) {
                    this.changeStatusRob(m)
                }
            })
            this.hisMessageList = msgList
            this.hisMessageList.sort((a, b) => {
                return a.id - b.id
            })
        },
        getHistoryMessage(pageNo) {
            let self = this;
            if (!pageNo) {
                pageNo = 1;
            }
            self.showHistory = true
            let str = this.chatType === 1 ? 'queryGroupMessages' : 'queryFriendMessages'
            this.$socket[str](this.chat.chatId, this.user.operId, pageNo, res => {
                this.count = res.totalSize
                this.historyResponse(res.response.data)
            });

            // 每次滚动到最底部
            self.$nextTick(() => {
                imageLoad('his-chat-message');
            });
        },
        showChatInfo() {
            this.disabledSay = 0
            this.queryPageMessages()
            this.queryMembers()
            if (this.chatType === 1) {
                this.queryNotice()
            }
            this.openChat()
            this.getGroupInfo()
            this.send2(0, '')
        },
        queryMembers() {
            this.$socket.queryMembers(this.chat.chatId, this.user.operId, (res) => {
                this.members = res.members
            })
        },
        queryPageMessages() {
            let self = this
            const str = this.chatType === 1 ? 'queryGroupMessages' : 'queryFriendMessages'
            this.$socket[str](self.chat.chatId, self.user.id, 1, (res) => {
                if (res.success) {
                    console.log(res)
                    self.msgList = res.response.data
                    self.msgList.sort((a, b) => a.id - b.id)
                    self.$nextTick(() => {
                        imageLoad('his-chat-message');
                    });
                }
            })
        },
        queryNotice() {
            this.$socket.queryNotice(this.user.operId, this.chat.chatId, res => {
                if (res.success) {
                    this.groupNotice = res.context;
                } else {
                    this.$message.error('获取数据失败');
                }
            });
        },

        // openBig(img){
        //   this.BigImage = img
        //   this.imageShow = true
        // },
        // smallImage(){
        // 	this.imageShow = false
        // 	this.BigImage = ''
        // },
        openVoice: function (videoUrl, length) {
            var type = videoUrl.substr(videoUrl.lastIndexOf('.') + 1, videoUrl.length);
            if ('amr' == type) {
                var url = apiServer.sysConfig.uploadFileUrl + 'upload/amrToMp3';
                var data = WEBIM.createOpenApiSecret();
                data.paths = videoUrl;
                var obj = {
                    url: url,
                    data: data
                };
                var that = this;
                apiServer.postToMp3(obj, function (result) {
                    videoUrl = result.data.data[0].oUrl;
                    that.audio = new Audio();
                    that.audio.src = videoUrl;
                    let playPromise;
                    //
                    playPromise = that.audio.play();
                    let second = length;
                    if (playPromise) {
                        playPromise
                            .then(() => {
                                // 音频加载成功
                                // 音频的播放需要耗时
                                that.tiemr = setInterval(() => {
                                    second--;
                                    if (second <= 0) {
                                        that.audio.pause();
                                        clearInterval(that.tiemr);
                                    }
                                }, 1000);
                            })
                            .catch(e => {
                                // 音频加载失败
                            });
                    }
                });
            } else if ('wav' == type) {
                // videoUrl = result.data.data[0].oUrl;
                this.audio = new Audio();
                this.audio.src = videoUrl;
                let playPromise;
                playPromise = this.audio.play();
                let second = length;
                if (playPromise) {
                    playPromise
                        .then(() => {
                            // 音频加载成功
                            // 音频的播放需要耗时
                            this.tiemr = setInterval(() => {
                                second--;
                                if (second <= 0) {
                                    this.audio.pause();
                                    clearInterval(this.tiemr);
                                }
                            }, 1000);
                        })
                        .catch(e => {
                            // 音频加载失败
                        });
                }
            } else {}
        },
        // 点击地图消息
        openMap: function (x, y) {
            alert('未完成');
            //this.$router.push({path:'/Map',query:{location_x:x,location_y:y}});
        },
        openCard: function (userId) {
            alert('未完成');
            //this.$router.push({path:'/UserInfo',query:{userId:userId}});
        },
        openFile: function (row) {
            let type = this.iconByType(row);
            this.fileUrl = row.content;
            if (type.indexOf('doc') != -1 || type.indexOf('docx') != -1 || type.indexOf('xsl') != -1 || type.indexOf('xslx') != -1) {
                this.showDoc = true;
            } else if (type.indexOf('pdf') != -1) {
                this.pdfUrl = 'http://47.105.218.26:8888/group1/M00/00/00/rB-LJlzT042AbKdCAAiu_35Yccs182.pdf';
                this.showPdf = true;
            } else if (type.indexOf('jpg') != -1 || type.indexOf('png') != -1 || type.indexOf('jpeg') != -1) {
                this.images = row.content
                var divClass = ".fileMsg_divShow"
                const viewer = this.$el.querySelector(divClass).$viewer
                viewer.show()
            } else if (
                type.indexOf('avi') != -1 ||
                type.indexOf('mp4') != -1 ||
                type.indexOf('webm') != -1 ||
                type.indexOf('m4v') != -1 ||
                type.indexOf('rmvb') != -1 ||
                type.indexOf('mpg') != -1 ||
                type.indexOf('3gp') != -1 ||
                type.indexOf('swf') != -1 ||
                type.indexOf('mkv') != -1
            ) {
                this.positivePlayerOptions.sources[0].src = '//nos.netease.com/vod163/demo.mp4';
                this.positivePlayerOptions.sources[0].type = 'video/mp4';
                this.showVideo = true;
            } else {
                this.$message('当前文件暂不支持预览');
            }
            // this.showPdf = true
            //this.$router.push({path:'/FileInfo',query:{FileInfo:data}});
        },

        iconByType(row) {
            if (null == row.fileName) {
                return row.content.substring(row.content.lastIndexOf('.') + 1, row.content.length);
            }
            return row.fileName.substring(row.fileName.lastIndexOf('.') + 1, row.fileName.length);
        },
        closePreviewClick() {
            this.showDoc = false;
            this.showPdf = false;
            this.showVideo = false;
        },
        setUserCache() {
            this.$socket.getUserById(this.user.operId, res => {
                localStorage.setItem('user', JSON.stringify(res.user))
            })
        },
        redpacketRespon(res) {
            this.msgList.forEach(m => {
                if (m.id === res.msgId) {
                    if (res.userId === this.user.operId || this.redPacketItem.id === m.id || this.popupRobVisible === false) {
                        m.msgContext = res.message
                        this.changeStatusRob(m)
                        this.redPacketItem = m
                        this.packet = JSON.parse(m.msgContext).Packets[0]
                        this.records = this.packet.Records
                        this.setUserCache()
                    }
                }
            })
        },
        cancelRespone(res) {
            for (var i in this.msgList) {
                if (this.msgList[i].id === res.msgId) {
                    this.msgList.splice(i, 1)
                }
            }
        },
        screenMsg(msg, res) {
            // 用户消息
            switch (msg.msgType) {
                case 0:
                    this.addTextMsg(msg);
                    break;
                case 1:
                    this.addImgMsg(msg);
                    break;
                case 3:
                    this.addVoiceMsg(msg);
                    break;
                case 6:
                    this.addRevoke(res);
                    break;
                case 7:
                    this.addRedEnvelopeMsg(msg);
                    break;
                case 8:
                    this.addRobEnvelope(msg);
                    break;
            }
            //非自己的消息震动
            if (msg.sendUid != this.user.operId) {
                this.vibrateLong()
            } else {
                this.openChat();
            }
            this.$nextTick(function () {
                // this.scrollToView = 'msg'+msg.id
            });
        },
        addRobEnvelope(res) {
            if (res.msgId != undefined && res.message != undefined) {
                this.packet = this.redenvelopeProcess(res.message)
            }
        },
        //处理红包数据
        redenvelopeProcess(msgContext) {
            let packets = JSON.parse(msgContext).Packets;
            let msg = {
                description: '红包异常',
                money: 0,
                number: 0
            }
            if (packets == undefined)
                return msg;
            return packets[0];
        },
        addRevoke(res) {
            if (res.msgId != undefined && res.message == undefined) {
                for (var index in this.msgList) {
                    if (this.msgList[index].id == res.msgId) {
                        this.msgList.splice(index, 1)
                    }
                }
            }
        },
        // 添加文字消息到列表
        addTextMsg(msg) {
            this.msgList.push(msg);
        },
        // 添加语音消息到列表
        addVoiceMsg(msg) {
            this.msgList.push(msg);
        },
        // 添加图片消息到列表
        addImgMsg(msg) {
            //msg.msgContext = this.setPicSize(msg.msgContext);
            let url = this.$url + msg.msgContext
            this.msgImgList.push(url);
            this.msgList.push(msg);
        },
        addRedEnvelopeMsg(msg) {
            this.msgList.push(msg);
        },
        // 添加系统文字消息到列表
        addSystemTextMsg(msg) {
            this.msgList.push(msg);
        },
        // 添加系统红包消息到列表
        addSystemRedEnvelopeMsg(msg) {
            this.msgList.push(msg);
        },
        vibrateLong() {
            this.audio = new Audio();
            this.audio.src = '../../../../../static/assets/mp3/msg.mp3';
            let playPromise;
            playPromise = this.audio.play();
            let second = length;
            if (playPromise) {
                playPromise
                    .then(() => {
                        // 音频加载成功
                        // 音频的播放需要耗时
                        this.tiemr = setInterval(() => {
                            second--;
                            if (second <= 0) {
                                this.audio.pause();
                                clearInterval(this.tiemr);
                            }
                        }, 1000);
                    })
                    .catch(e => {
                        // 音频加载失败
                    });
            }
        },
        select2(msgType, text) {
            let _this = this
            let arr = ['send2Friend','send2Group']
            this.$socket[arr[this.chatType]](this.chat.chatId, _this.user.operId, text, msgType, res => {
                console.log(res)
                if (res.success) {
                    if (res.response != undefined) {
                        let data = res.response.data
                        if(_this.chatType===1){
							if (data.groupId === _this.chat.chatId) {
								_this.screenMsg(data, res);
							}
						}else if(this.chatType===0){
					      _this.screenMsg(data, res);
						}
                    }
                }
            })
        },
        send2(msgType, text) {
            if (this.disabledSay === 1&&this.chatType===1) {
                alert('你已经被禁言')
                return false
            }
            this.select2(msgType, text)
            if (this.messageContent !== '' && this.chatType === 1) {
                this.$socket.createChatList(this.user.operId, this.chat.chatId, text, msgType, res => {})
            }
            this.messageContent = ''
        },
        handleRollback(item) {
            let self = this
            let del = self.chatType === 0 ? 'deleteFriendMsg' : 'deleteGroupMsg'
            self.$socket[del](this.user.operId, item.id, self.groupInfo.group.id, res => {
                if (res.success) {
                    self.send2(6, item.id)
                }
            })
        },
        changeStatusRob(m) {
            const {
                Packets
            } = JSON.parse(m.msgContext)
            let packet = Packets && Packets[0] || undefined
            if (packet === undefined) {
                return
            }
            let records = packet.Records
            if (records === undefined) {
                return
            }
            records.forEach(r => {
                if (packet.surplusNumber === 0 && packet.surplusMoney === 0) {
                    m.status = 2
                }
                if (r.robUid === this.user.operId) {
                    m.status = 2
                }
            })
        },
        responLastMessage(msgList) {
            let self = this
            msgList.forEach(m => {
                if (!self.msgList.map(v => v.id).includes(m.id)) {
                    if (m.msgType === 7) {
                        this.changeStatusRob(m)
                    }
                    self.msgList.push(m)
                    if (m.sendUid === this.user.operId) {
                        self.$nextTick(() => {
                            imageLoad('message-box');
                        });
                    }
                }
            })
        }
    },
    watch: {
        chat: function () {
            this.showChatInfo();
        }
    },
    mounted: function () {
        this.$nextTick(() => {
            imageLoad('message-box');
        });
        this.showChatInfo();
    },
    updated() {
        this.$nextTick(() => {
            imageLoad('message-box');
        });
    }
};
</script>

<style lang="scss">
@import '../../../../../static/styles/theme';
#his-chat-message {
    padding: 1rem;
}

.im-chat {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 4rem;
    overflow: hidden;
}

.im-chat-top {
    border-bottom: 1px solid #cccccc;
    color: $color-default;
    padding: 0 0 0.2rem 1rem;
    font-size: 1.6rem;
    font-weight: bold;
    height: 40px;

    .menu {
        color: $color-default;
        display: inline-block;
        padding: 0 10px;
    }
}

.user-model {
    .user-model-img {
        padding: 0 30px;
        text-align: center;

        img {
            border-radius: 50%;
        }
    }

    .user-model-item {
        margin-top: 10px;
        text-align: center;

        label {
            font-weight: bold;
        }
    }
}

.im-chat-main {
    flex: 1;
    display: flex;
    flex-direction: row;
    height: calc(100% - 41px);
    border-bottom: 1px solid #e8eaec;

    .im-chat-main-left {
        flex: 4;
        display: flex;
        flex-direction: column;

        .im-chat-main-box {
            flex: 1;
            padding: 1rem;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }

    .message-img {
        max-width: 20rem;
    }

    .im-chat-users {
        flex: 1;
        border-left: 1px solid #cccccc;
        overflow: auto;
    }

    .messages {
        width: 100%;
        height: 100%;
        overflow: auto;

        ul {
            width: 100%;

            li {
                position: relative;
                font-size: 0;
                margin-bottom: 10px;
                padding-left: 60px;
                min-height: 68px;

                .im-chat-text {
                    position: relative;
                    line-height: 22px;
                    margin-top: 25px;
                    padding: 0.8rem 1.5rem;
                    background-color: #FDFDFD;
                    border-radius: 3px;
                    color: #171717;
                    word-break: break-all;
                    display: inline-block;
                    vertical-align: top;
                    font-size: 14px;
                    max-width: 300px;

                    &:after {
                        content: '';
                        position: absolute;
                        left: -10px;
                        top: 13px;
                        width: 0;
                        height: 0;
                        border-style: solid dashed dashed;
                        border-color: #FDFDFD transparent transparent;
                        overflow: hidden;
                        border-width: 10px;
                    }

                    pre {
                        width: 100%;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }
                }
            }
        }

        .im-chat-user {
            width: 4rem;
            height: 4rem;
            position: absolute;
            display: inline-block;
            vertical-align: top;
            font-size: 14px;
            left: 3px;
            right: auto;

            cite {
                position: absolute;
                left: 60px;
                top: -2px;
                width: 500px;
                line-height: 24px;
                font-size: 12px;
                white-space: nowrap;
                color: #999;
                text-align: left;
                font-style: normal;

                i {
                    font-style: normal;
                    padding-left: 15px;
                }
            }

            img {
                width: 4rem;
                height: 4rem;
                border-radius: 100%;
            }
        }

        .im-chat-mine {
            text-align: right;
            padding-left: 0;
            padding-right: 60px;

            .im-chat-text {
                margin-left: 0;
                text-align: left;
                background-color: $color-message-bg;
                color: #171717;
                display: inline-block;
                vertical-align: top;
                font-size: 14px;
                max-width: 300px;

                &:after {
                    left: auto;
                    right: -10px;
                    border-top-color: $color-message-bg;
                }
            }

            .im-chat-user {
                left: auto;
                right: 3px;

                cite {
                    left: auto;
                    right: 60px;
                    text-align: right;

                    i {
                        padding-left: 0;
                        padding-right: 15px;
                    }
                }
            }
        }
    }
}

.im-chat-footer {
    border-top: 1px solid $color-gray;
    height: 15rem;
    display: flex;
    flex-direction: column;

    .im-chat-tool {
        padding: 0.5rem 1rem;
        height: 3.4rem;
        position: relative;

        i {
            font-size: 2.4rem;
            cursor: pointer;
            margin-left: 1rem;
        }

        .faces-box {
            position: absolute;
            bottom: 3.8rem;
        }

        .ivu-upload {
            display: inline-block;
        }

        .history-message-btn {
            float: right;
        }
    }

    textarea {
        border: 0;
        padding: 0 1rem;
        width: 100%;
        flex: 1;
        resize: none;
        background-color: $color-box-bg !important;

        &:focus {
            border: 0;
        }
    }

    .im-chat-send {
        padding: 0 1rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
}

/* 重新覆盖iview 里面的 model 小于768px 时候 宽度变100% 的问题 */
@media (max-width: 768px) {
    .user-model {
        .ivu-modal {
            width: 30rem !important;
            margin: 0 auto;
        }
    }
}

.history-message {
    width: 80%;
    height: calc(100% - 30px);
}

.page {
    text-align: right;
    padding-top: 7px;
    padding-right: 16px;
    width: 100%;

    li {
        background: #f3f3f3;
    }
}

.ivu-drawer-body {
    padding: 0 !important;

    .messages {
        height: 100%;
    }
}

.chat-user-list {
    list-style: none;
    margin: 0;
    padding: 1rem;

    &>li {
        margin-bottom: 1rem;
        cursor: pointer;

        &>.im-chat-avatar {
            width: 3.2rem;
            height: 3.2rem;
            display: inline-block;
            vertical-align: middle;

            &>img {
                width: 100%;
                height: 100%;
            }
        }
    }
}

// .transmit{
//   float:right;
// }
.transmit span {
    word-break: normal;
    width: auto;
    display: block;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
}

.group-box {
    width: 100%;
    float: right;
    height: 100%;
    overflow: auto;

    .count {
        color: #aaaaaa;
    }

    li {
        list-style: none;
        position: relative;
        font-size: 1.2rem;
        cursor: pointer;
        font-weight: 200;

        h5 {
            padding: 0.5rem 0;
            cursor: pointer;
            font-size: 1.3rem;
            font-weight: 200;

            i {
                vertical-align: baseline;
            }
        }

        img {
            width: 4.4rem;
            height: 4.4rem;
            position: absolute;
            top: 0.4rem;
            left: 2rem;
        }

        b {
            position: absolute;
            font-size: 1.3rem;
            left: 7.5rem;
            width: 12rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 600;
            top: 0.6rem;
        }

        p {
            position: absolute;
            left: 7.5rem;
            bottom: 0.4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 75%;
            font-size: 1.1rem;
            color: #aaaaaa;
        }
    }

    .user {
        height: 5.2rem;
        position: relative;

        a {
            display: block;
            width: 100%;
            height: 100%;
            color: $color-default;
            position: relative;

            i {
                display: inline-block;
                width: 1.8rem;
                height: 1.6rem;
                background-color: #ff0000;
                border-radius: 50%;
                color: $color-write;
                text-align: center;
                font-style: normal;
                position: absolute;
                left: 1rem;
                top: 0;
                z-index: 99999999999;
            }

            p {
                width: 12rem;
            }
        }

        &:hover {
            background-color: $color-gray !important;

            &>i {
                color: $color-default;
                background-color: $color-write;
            }
        }

        .active {
            background-color: $color-gray !important;
        }

        &>i {
            position: absolute;
            right: 1rem;
            bottom: 1.6rem;
            cursor: pointer;
            border-radius: 50%;
            padding: 0.2rem;
            text-align: center;
            color: $color-light-gray;

            &:hover {
                color: $color-default;
                background-color: $color-write;
            }
        }
    }
}

 .message-red-packet-left {
	position: relative;
	border-radius: 0.106667rem;
	background: orange;
	font-size: 0.4rem;
	color: #fff;
	text-align: right;
	display: inline-table;
	max-width: 300px;
	min-width: 200px;
	height: 70px;
	box-shadow: 1px 1px 1px 1px #efefef;
	.packet {
	  padding-right: 12px;
	}
	.text {
	  height: 40px;
	  color: #fff;
	  padding: 10px;
	  i {
		color: red;
		font-size: 25px;
		float: right;
	  }
	}
	.footer {
	  margin-top: 8px;
	  height: 25px;
	  background: white;
	  padding-right: 5px;
	  color: #797979;
	}
	.arrow-org {
	  width: 10px;
	  height: 10px;
	  background: orange;
	  position: absolute;
	  left: -2px;
	  top: 10px;
	  transform: rotate(45deg);
	}
	}
</style>
