<template>
  <div class="del-member">
    <div class="form" >
      <mt-header fixed title="聊天成员">
        <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
        <mt-button v-show="this.selectUsers.length === 0" slot="right" class="red"  disabled="disabled">删除</mt-button>
        <mt-button class="red" v-show="this.selectUsers.length !== 0" slot="right" @click="delGroupMember" >
          删除({{this.selectUsers.length}})
        </mt-button>
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
export default {
  name: 'delMember',
  data () {
    const user = localStorage.getItem('user')
    const groupItem = localStorage.getItem('groupItem')
    const groupChatItem = localStorage.getItem('groupChatItem')
    return {
      ids: [],
      defaultGroupNames: [],
      selectUsers: [],
      avatar: '',
      checkValue: [],
      show: true,
      fixedButton: '',
      count: 0,
      user: (user && JSON.parse(user)) || null,
      groupChatItem: (groupChatItem && JSON.parse(groupChatItem)) || {},
      groupItem: (groupItem && JSON.parse(groupItem)) || null,
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
    this.$socket.queryMembers(this.groupChatItem.chatId, this.user.id, (res) => {
      this.members = res.members
      this.groupUser = res.groupUser
      this.group = res.group
      let groupItem = {
        group: this.group,
        groupUser: this.groupUser
      }
      localStorage.setItem('groupItem', JSON.stringify(groupItem))
      this.list = res.members
    })
  },
  methods: {
    checkClick (e) {
      this.selectUsers = e
      this.selectUsers.forEach((item) => {
        this.ids.push(item.id)
      })
    },
    delGroupMember () {
      this.$socket.delGroupMember(this.groupItem.group.id, this.ids, res => {
        if (res.success) {
          this.$router.push('/groupInfo').then()
        }
      })
    }
  }
}
</script>

<style lang="less">
  .del-member {
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
        .red {
          background-color: red;
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
