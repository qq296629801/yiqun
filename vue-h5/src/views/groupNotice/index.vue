<template>
  <div class="max-card">
    <div className="max-card-box">
      <mt-header fixed :title="'群公告'">
        <mt-button slot="left" @click="$router.go(-1)" icon="back">返回</mt-button>
        <mt-button slot="right" @click="updateNotice" v-if="groupInfo.groupMaster || groupInfo.operUser===user.userName">保存</mt-button>
      </mt-header>
      <span className="max-card-name"></span>
      <mt-field v-show="true" v-if="groupInfo.groupMaster || groupInfo.operUser===user.userName" rows="15" v-model="context" type="textarea"></mt-field>
      <mt-field v-else v-html="context"></mt-field>
      <span className="card-tips">在这里可以设置公告</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MaxCard',
  data () {
    const groupInfo = localStorage.getItem('groupInfo')
    const user = localStorage.getItem('user')
    const groupId = this.$route.params.groupId
    return {
      groupInfo: (user && JSON.parse(groupInfo)) || {},
      user: (user && JSON.parse(user)) || null,
      groupId,
      context: ''
    }
  },
  mounted () {
    this.queryNotice()
  },
  methods: {
    queryNotice: function () {
      this.$socket.queryNotice(this.groupId, (res) => {
        if (res.success) {
          this.context = res.context
        }
      })
    },
    updateNotice: function () {
      this.$socket.updateNotice(this.user.id, this.groupId, this.context, (res) => {
        if (res.success) {
          this.context = res.context
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style lang="less">
  .max-card {
    height: 100%;
    background: #fff;
    .max-card-name {
      padding-top: 40px;
      font-size: 18px;
      color: #000;
    }
    .card-tips {
      padding-bottom: 20px;
    }
    .max-card-box {
      position: absolute;
      border-radius: 4px;
      width: 338px;
      height: 400px;
      top: 50%;
      left: 50%;
      margin-left: -169px;
      margin-top: -200px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-direction: column;
    }
  }
</style>
