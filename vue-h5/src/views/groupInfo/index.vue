<template>
  <div class="member">
    <mt-header fixed :title="'聊天信息('+this.members.length+')'">
      <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
    </mt-header>
    <mt-search class="member-search" v-model="condition"></mt-search>
    <div class="member-top" @click="showAllMember=!showAllMember">
        <div class="member-item" v-for="(member, i) in list" :key="i">
          <img class="img" :style="!member.isOnline?'filter: grayscale(100%);':''" :src="`${$url}/${member.avatar}`" alt="" @click="handOpenChat(member)">
          <span>{{member.remarkName || member.groupNickName}}</span>
        </div>
        <div class="member-item">
          <i slot="icon" class="iconfont icon-zengjia-01 icon-size" @click="addGroupMember"></i>
        </div>
        <div class="member-item" v-show="groupUser.groupMaster">
          <i slot="icon" class="iconfont icon-jianshao-01 icon-size" @click="delGroupMember"></i>
        </div>
    </div>
    <div class="member-mid">
      <mt-cell v-if="groupUser.groupMaster" title="群名称" :to="`/editName/2`" is-link :value="group.groupName"></mt-cell>
      <mt-cell v-else title="群名称" :value="group.groupName"></mt-cell>
      <mt-cell title="群公告" :to="`/groupNotice/${group.id}`" is-link value="">{{notice}}</mt-cell>
      <mt-cell title="群昵称" :to="`/editName/1`" is-link :value="groupUser.groupNickName"></mt-cell>
      <mt-cell v-show="groupUser.groupMaster" title="群转让" :to="`/transferGroup`" is-link></mt-cell>
      <div class="member-footer">
        <mt-cell title="查找聊天内容" to="/groupHistory" is-link value=""></mt-cell>
      </div>
    </div>
   <div class="member-footer">
      <div class="my-border name" @click="handleClearMessage">清空聊天记录</div>
      <div class="my-border name" @click="handleExitGroup">删除并退出</div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  name: 'Member',
  data () {
    const userItem = localStorage.getItem('user')
    const chatItem = localStorage.getItem('groupChatItem')
    const cacheItem = localStorage.getItem('memberList')
    const groupUserItem = localStorage.getItem('groupInfo')
    return {
      list: [],
      showAllMember: false,
      user: (userItem && JSON.parse(userItem)) || null,
      chatItem: (chatItem && JSON.parse(chatItem)) || {},
      members: (cacheItem && JSON.parse(cacheItem)) || [],
      onlineUsers: [],
      group: {},
      groupUser: (groupUserItem && JSON.parse(groupUserItem)) || {},
      notice: '未设置',
      condition: ''
    }
  },
  mounted () {
    this.$socket.queryNotice(this.user.id, this.chatItem.chatId, (res) => {
      if (res.success) {
        this.notice = res.context
      }
    })
    this.$socket.queryMembers(this.chatItem.chatId, this.user.id, (res) => {
      this.members = res.members
      this.groupUser = res.groupUser
      this.group = res.group
      this.list = res.members
      let groupInfo = {
        groupMaster: this.groupUser.groupMaster,
        groupNickName: this.groupUser.groupNickName,
        groupName: this.group.groupName,
        operUser: this.group.operUser,
        id: this.group.id
      }
      localStorage.setItem('groupInfo', JSON.stringify(groupInfo))
      this.onlineUsers = res.onlineUsers
      this.checkIsOnline(this.onlineUsers, this.members)
      localStorage.setItem('memberList', JSON.stringify(this.members))
    })
  },
  watch: {
    condition (val) {
      this.list = this.members.filter(v => { return v.groupNickName.includes(val) })
    }
  },
  methods: {
    handleExitGroup () {
      this.$socket.removeGroupUser([this.user.id], this.group.id, res => {
        if (res.success) {
          this.$router.push('/chatList').then()
        }
      })
    },
    addGroupMember () {
      this.$router.push('/contactList').then()
    },
    delGroupMember () {
      this.$router.push('/delMember').then()
    },
    handleClearMessage () {
      this.$socket.clearGroupMsg(this.user.id, this.chatItem.chatId, res => {
        if (res.success) {
          /* if (window.isApp) {
            this.$sqlite.open()
            this.$sqlite.deleteGroupByChatId(this.chatItem.chatId)
            this.$sqlite.close()
          } */
          Toast('已清空')
        }
      })
    },
    checkIsOnline (target, origin) {
      if (!target.length) {
        return false
      }
      for (let i = 0; i < target.length; i++) {
        for (let k = 0; k < origin.length; k++) {
          if (target[i] && (target[i].userId === origin[k].chatId)) {
            origin[k].isOnline = true
            target[i] = ''
          }
        }
      }
    },
    handOpenChat (member) {
      let groupItem = {
        group: this.group,
        groupUser: this.groupUser
      }
      localStorage.setItem('groupItem', JSON.stringify(groupItem))
      localStorage.setItem('userItem', JSON.stringify(member))
      this.$router.push('/remarks')
      // if (this.groupUser.groupMaster || this.group.operUser === this.user.userName) {
      //   if (member.id !== this.user.id) {
      //     this.$router.push('/friendChat')
      //     localStorage.setItem('friendChatItem', JSON.stringify(member))
      //   } else {
      //     Toast('无权发起')
      //   }
      // }
    }
  }
}
</script>
<style lang="less">
  .member {
    .mint-searchbar {
      background: #f6f7f8;
    }
    .member-search {
      height: 50px;
    }
    .member-mid {
      margin-top: 10px;
    }
    .member-footer {
      margin-top: 20px;
      background: #fff;
      .name {
        height: 70px;
        color: #FF6464;
        font-size: 15px;
        text-align: center;
        line-height: 70px;
      }
    }
    .icon-ico {
      font-size: 20px;
    }
    .member-top {
      height: 180px;
      overflow-x: hidden;
      overflow-y: auto;
      padding-bottom: 14px;
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      .add-box {
        border: 1px dashed #D8D8D8;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont {
          color: #D8D8D8;
          font-size: 20px;
        }
      }
      .member-item {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-direction: column;
        padding-top: 14px;
        position: relative;
        .icon-size {
          color: #26a2ff;
          font-size: 40px;
          padding: 5px;
          background: #f7f7f7;
          border-radius: 10px;
        }
        i {
          color: #26a2ff;
          font-size: 7px;
        }
        span {
          font-size: 12px;
          color: #748EAC;
          margin-top: 5px;
          overflow: hidden;
          width: 50%;
        }
        .img {
          width: 50px;
          height: 50px;
          border-radius: 10px;
        }
      }
    }
  }
</style>
