<template>
  <div class="remarks-name">
    <mt-header fixed title="用户详情">
      <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
      <mt-button v-if="user.id === userItem.sendUid" slot="right"></mt-button>
      <mt-button v-else slot="right" @click="handUserUpdate">保存</mt-button>
    </mt-header>
    <div class="mine-top-box">
      <img v-preview="`${$url}/${userItem.avatar}`" :src="`${$url}/${userItem.avatar}`" alt="">
      <div class="info">
        <span class="name">{{ name || userItem.remarkName || userItem.groupNickName || userItem.userName }}</span>
        <span class="num">来源：群聊</span>
      </div>
    </div>
    <mt-field :disabled="user.id === userItem.chatId" label="设置备注" placeholder="请输入备注名" v-model="name"></mt-field>
    <div class="member-footer">
      <div class="my-border name" v-if="groupItem.group.operUser === user.userName || groupItem.groupUser.groupMaster" @click="handleJumpChat"><i slot="icon" class="iconfont icon-conversation_icon"></i> 发消息</div>
      <!-- <div class="my-border name">删除并退出</div>-->
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  name: 'EditName',
  data () {
    // 包含了发送人
    const userItem = localStorage.getItem('userItem')
    const user = localStorage.getItem('user')
    const groupItem = localStorage.getItem('groupItem')
    return {
      userItem: userItem && JSON.parse(userItem),
      user: (user && JSON.parse(user)) || null,
      name: '',
      groupItem: (groupItem && JSON.parse(groupItem)) || null
    }
  },
  mounted () {
    const { chatId } = this.userItem
    this.$socket.getUserRemark(this.user.id, chatId, res => {
      if (res.success) {
        if (res.remark != null) {
          this.name = res.remark.remarkName
        }
      }
    })
  },
  methods: {
    handleJumpChat () {
      localStorage.setItem('friendChatItem', JSON.stringify(this.userItem))
      this.$router.push('/friendChat')
    },
    handUserUpdate () {
      const { chatId } = this.userItem
      this.$socket.updateRemarkName(this.user.id, chatId, this.name, res => {
        if (res.success) {
          Toast('保存成功')
        } else {
          Toast('保存失败')
        }
      })
    }
  }
}
</script>
<style lang="less">
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
  .remarks-name {
    .mint-cell-wrapper {
      height: 50px;
    }
    .mine-top-box {
      margin-top: 10px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      height: 150px;
      margin-bottom: 10px;
      .name {
        font-size: 20px;
        color: #22252E;
        font-weight: 700;
      }
      .num {
        color: #797B80;
      }
      .info {
        margin-left: 20px;
        width: 60%;
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        .name {
          width: 100%;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        i {
          font-size: 18px;
          color: orange;
        }
      }
      img {
        width: 64px;
        height: 64px;
        border-radius: 10px;
      }
    }
  }
</style>
