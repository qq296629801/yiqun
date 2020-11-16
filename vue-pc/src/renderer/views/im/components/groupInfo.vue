<template>
    <div>
        <Drawer
                :title="$store.state.openUserName"
                :closable="true"
                v-model="groupModal"
                class="history-message"
                width="35%"
                placement="right"
        >
            <Form :model="formItem" :label-width="100" style="margin-top: 50px;">
                <FormItem label="群名">
                    <span>{{ roomName }}</span>
                </FormItem>
                <FormItem label="群组说明">
                    <span>{{ roomDesc }}</span>
                </FormItem>
                <FormItem label="群公告">
                    <span>{{ roomNotic }}</span>
                </FormItem>
                <FormItem label="群共享文件">
                </FormItem>
                <FormItem label="设置群昵称">
                </FormItem>
                <FormItem label="显示成员昵称">
                    <i-switch v-model="formItem.switch" size="large">
                        <span slot="open">On</span>
                        <span slot="close">Off</span>
                    </i-switch>
                </FormItem>
                <FormItem label="消息免打扰">
                    <i-switch v-model="formItem.switch" size="large">
                        <span slot="open">On</span>
                        <span slot="close">Off</span>
                    </i-switch>
                </FormItem>
                <FormItem label="置顶聊天">
                    <i-switch v-model="formItem.switch" size="large">
                        <span slot="open">On</span>
                        <span slot="close">Off</span>
                    </i-switch>
                </FormItem>
            </Form>
        </Drawer>
    </div>
</template>
<script>
    export default {
        name: "groupInfo",
        data() {
            return{
                groupModal: false,
                formItem: {
                    switch: ''
                },
                roomInfo:'群组信息',
                roomName:'', // 群组名称
                roomDesc:'',// 群组说明
                roomNotic:'',// 群组公告
                allBanned:false,// 全体禁言
                isRole:0,// 角色
                roomId:'',// 群组Id
                roomJid:'',// 群组jid
                show:false,// 是否弹出提示
                Please:'',// 提示内容
                allMember:[],
                ifModifyRoomName:false,
                ifModifyRoomDesc:false,
                otherName:"",
                otherDesc:"",
                showToast1:false,
                showToast2:false,
                showToast3:false,
                showToast5:false,
                showToast4:false,
                showReadNum:store.state.showReadNum[this.roomJid],//显示已读人数
            }
        },
        created(){

            let that = this;
            if(!apiServer.isNull(that.$route.query.room.id)){
                that.$store.state.roomId = that.$route.query.room.id
            }
            // store.commit("setshowReadNum",that.showReadNum)
            if(!apiServer.isNull(that.$store.state.roomId)){
                apiRequest.getRoom(that.$store.state.roomId,function(result){
                    store.commit("setRoomInfo",result.data);
                    that.roomName = that.$store.state.roomInfo.name;
                    that.roomDesc = that.$store.state.roomInfo.desc;
                    that.roomNotic = that.$store.state.roomInfo.notice.text;
                    if(apiServer.isNull(that.roomNotic)){
                        that.roomNotic = "暂无公告";
                    }
                    that.isRole = result.data.member.role;
                    that.roomId = result.data.id;
                    that.roomJid = result.data.jid;
                    that.showReadNum = store.state.showReadNum[that.roomJid]
                    // let isReadNum = that.$store.state.showReadNum
                    // isReadNum[that.roomJid] = false;
                    // store.commit("setshowReadNum",isReadNum)
                    // that.showReadNum = isReadNum[that.roomJid]
                    that.allMember = result.data.members
                    for(let i=0;i<that.allMember.length;i++){
                        that.allMember[i].avatar = apiServer.getAvatarUrl(that.allMember[i].userId)
                    }
                    that.$store.state.allMember = that.allMember

                })

            }

        },
        watch:{
            allBanned(val){
                let that= this
                let time = parseInt((new Date().getTime())/1000)
                if(val){
                    apiServer.postData({
                        url:'/room/update',
                        data:{
                            talkTime:15*24*60*60+time,
                            access_token:token,
                            time:time,
                            roomId:that.roomId
                        }
                    },function(data){
                        // that.ifShowNowords = false
                        // that.showToast = true
                    })
                }else{
                    apiServer.postData({
                        url:'/room/update',
                        data:{
                            talkTime:0,
                            access_token:token,
                            time:time,
                            roomId:that.roomId
                        }
                    },function(data){
                        // that.ifShowNowords = false
                        // that.showToast = true
                    })
                }
            },
            showReadNum(val){
                let that = this
                let isReadNum = that.$store.state.showReadNum
                isReadNum[that.roomJid] = val;
                store.commit("setshowReadNum",isReadNum)
                let val2 = 0
                if(val){
                    val2 = 1
                }else{
                    val2 = 0
                }
                apiServer.postData({
                    url:'/room/update',
                    data:{
                        access_token:token,
                        roomId:that.roomId,
                        showRead:val2
                    }
                },function(data){

                    // that.ifShowNowords = false
                    // that.showToast = true
                })

            }
        },
        mounted(){},
        methods:{

            // 点击禁言
            noWords(){
                this.$router.push({path:"noWords",query:{allMember:this.allMember}})
            },
            // 点击进入群公告
            toRoomPublic(){
                this.$router.push({path:"roomPublic",query:{allMember:this.allMember}})
            },
            // 点击外部隐藏修改弹窗
            hideModify(){
                this.ifModifyRoomDesc = false;
                this.ifModifyRoomName = false;
            },
            // 确定修改群名
            comfirmModify(){

                let that = this
                this.roomName = this.otherName
                this.ifModifyRoomName = false
                apiServer.postData({
                    url:'/room/update',
                    data:{
                        roomId:that.roomId,
                        access_token:token,
                        roomName:that.roomName
                    }
                },function(data){
                })


            },
            // 确认修改群说明
            comfirmModifydesc(){
                let that = this
                this.roomDesc = this.otherDesc
                this.ifModifyRoomDesc = false
                apiServer.postData({
                    url:'/room/update',
                    data:{
                        roomId:that.roomId,
                        access_token:token,
                        desc:that.roomDesc
                    }
                },function(data){
                })
            },
            // 修改群名
            ModifyRoomName(){
                if(this.isRole==3){
                    this.showToast1 = true
                }else{
                    this.ifModifyRoomName = true
                }
            },
            // 修改群说明
            ModifyRoomDesc(){
                if(this.isRole==3){
                    this.showToast2 = true
                }else{
                    this.ifModifyRoomDesc = true
                }
            },
            // 跳转添加群成员界面
            selectPeople(){
                let user = sessionStorage.getItem('userId');
                this.$router.push({path:'/selectPeople',query:{card:user,roomId:this.roomId}});
            },
            // 删除群成员
            deletePeople(){
                let user = sessionStorage.getItem('userId');
                if(this.isRole==3){
                    this.showToast3 = true
                }else{
                    this.$router.push({path:'/deletePeople',query:{allMember:this.allMember,roomId:this.roomId}});
                }
            },
            // 跳转群成员界面
            getRoomMenber(){
                this.$router.push({path:"room_menber",query:{allMember:this.allMember}})
            },
            // 退出群组
            quitRoom:function(){
                let that = this;
                that.showToast4 = true
                apiRequest.quitRoom(that.roomId,function(result){
                    if(result.resultCode==1){
                        // that.Please = "退出群组成功";

                        // that.show = true;
                        let rooms=that.$store.state.rooms;
                        let myRooms=that.$store.state.myRooms;
                        delete rooms[that.roomId];
                        delete myRooms[that.roomJid];
                        store.commit("setMyRooms",myRooms);
                        store.commit("setRooms",rooms);
                        //维护消息列表
                        let list = that.$store.state.lastChatList
                        for(let i=0;i<list.length;i++){
                            if(list[i].jid == that.roomJid){
                                list.splice(i,1)
                                break
                            }
                        }
                        that.$store.commit("setLastChatMsg",list)
                        //由于退群还会收到一条消息导致角标异常
                        let num = parseInt(window.sessionStorage.getItem("sysMsgNum")||0)
                        num--
                        window.sessionStorage.setItem("sysMsgNum",num)
                        setTimeout(function(){
                            that.$router.go(-2);
                        },600)

                    }
                })
            },
            // 解散群组
            deleteRoom:function(){
                let that = this;
                that.showToast5 = true
                apiRequest.deleteRoom(that.roomId,function(result){
                    if(result.resultCode==1){

                        // that.Please = "解散群组成功";
                        // that.show = true;
                        let rooms=that.$store.state.rooms;
                        let myRooms=that.$store.state.myRooms;
                        delete rooms[that.roomId];
                        delete myRooms[that.roomJid];
                        store.commit("setMyRooms",myRooms);
                        store.commit("setRooms",rooms);
                        //维护消息列表
                        let list = that.$store.state.lastChatList
                        for(let i=0;i<list.length;i++){
                            if(list[i].jid == that.roomJid){
                                list.splice(i,1)
                                break
                            }
                        }
                        that.$store.commit("setLastChatMsg",list)
                        setTimeout(function(){
                            that.$router.go(-2);
                        },600)

                    }
                })
            },
            shareFile:function(){
                this.$router.push({path:'/SharedFile',query:{roomId:this.roomId}});
            }
        }
    }
</script>

<style scoped>
    .history-message {
        width: 80%;
        height: calc(100% - 30px);
    }
</style>