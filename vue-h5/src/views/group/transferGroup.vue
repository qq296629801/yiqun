<template>
  <div class="transfer-group">
    <div class="form" >
      <mt-header fixed title="转让群主">
        <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
        <mt-button v-show="this.selectUsers.length === 0" slot="right" class="blue"  disabled="disabled">确定</mt-button>
        <mt-button class="blue" v-show="this.selectUsers.length !== 0" slot="right" @click="transferGroup" >确定</mt-button>
      </mt-header>
      <mt-index-list>
        <mt-search class="search-box" v-model="chatName"></mt-search>
        <div class="member-top">
          <div class="member-item" v-for="(member, i) in list" :key="i">
            <mt-cell :key="i">
              <img class="img" :src="`${$url}/${member.avatar}`" alt="" @click="handOpenChat(member)">
              <mt-checklist :key="i" align="right" v-model="checkValue" :options="[{label: member.nickName, value: member, disabled: false}]" @change="checkClick($event)"></mt-checklist >
            </mt-cell>
          </div>
        </div>
      </mt-index-list>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
export default {
  name: 'transfer',
  data () {
    const user = localStorage.getItem('user')
    const group = localStorage.getItem('group')
    const chatItem = localStorage.getItem('groupChatItem')
    return {
      id: '',
      defaultGroupNames: [],
      selectUsers: [],
      avatar: '',
      checkValue: [],
      show: true,
      fixedButton: '',
      count: 0,
      user: (user && JSON.parse(user)) || null,
      chatItem: (chatItem && JSON.parse(chatItem)) || {},
      group: (group && JSON.parse(group)) || null,
      chatName: '',
      list: [],
      search: []
    }
  },
  watch: {
    condition (val) {
      this.list = this.members.filter(v => { return v.groupNickName.includes(val) })
    }
  },
  mounted () {
    this.$socket.queryMembers(this.chatItem.chatId, this.user.id, (res) => {
      this.members = res.members
      this.groupUser = res.groupUser
      this.group = res.group
      this.list = res.members
    })
  },
  methods: {
    checkClick (e) {
      this.selectUsers = e
      this.selectUsers.forEach((item) => {
        this.id = item.id
      })
    },
    transferGroup () {
      if (this.selectUsers.length > 1) {
        Toast('选择一个新群主')
        return
      }
      console.log(111)
      this.$socket.transferGroup(this.group.id, this.id, res => {
        if (res.success) {
          this.$router.push('/groupInfo').then()
        }
      })
    }
  }
}
</script>

<style lang="less">
  .transfer-group {
    .mint-header-title {
      vertical-align: middle;
      padding-top: 3px;
    }
    .mint-checklist .mint-checklist-label {
      width: 290px;
    }
    .mint-checklist .mint-cell-wrapper {
      background-image: -webkit-linear-gradient(top, #fff, #fff 50%, transparent 50%);
      background-image: linear-gradient(180deg, #fff, #fff 50%, transparent 50%);
    }
    .mint-indexsection .mint-cell-title .mint-checkbox-label {
      margin-left: -15px;
      font-size: 18px;
      letter-spacing: 1px;
      float: left;
    }
    .mint-indexsection .mint-cell-title {
      flex: none;
      -webkit-flex: none;
    }
    .mint-indexsection .mint-cell-wrapper {
      background-position-x: 45px;
    }
    .mint-search {
      height: auto;
      .mint-searchbar {
        background: #f6f7f8;
      }
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
    .mint-indexsection {
      text-align: left;
    }
    .group {
      .form {
        .blue {
          background-color: #26a2ff;
          width: 80px;
          color: #fff;
          height: 30px;
        }
        .nav {
          width: 10%;
          align-items: center;
          justify-content: flex-start;
          flex-direction: column;
          flex-wrap: nowrap;
          margin-left: 10px;
          display: inline;
        }
      }
    }
  }
</style>
