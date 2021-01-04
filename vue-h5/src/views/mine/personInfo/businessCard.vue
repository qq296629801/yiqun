<template>
  <div class="remarks-name">
    <mt-header fixed title="名片">
      <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
    </mt-header>
    <div class="mine-top-box">
      <img v-preview="`${$url}/${friend.avatar}`" :src="`${$url}/${friend.avatar}`" alt="">
      <div class="info">
        <span class="name">{{ friend.nickName }}</span>
        <span class="num">来源：来自扫一扫</span>
      </div>
    </div>
    <mt-field :disabled="user.id === friend.id" label="设置备注" placeholder="请输入备注名" v-model="name"></mt-field>
    <div class="member-footer">
      <div class="my-border name" @click="handleAddFriend">
        增加通讯录
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BusinessCard',
  data () {
    const user = localStorage.getItem('user')
    return {
      user: (user && JSON.parse(user)) || null,
      friend: {}
    }
  },
  mounted () {
    let uid = localStorage.getItem('uid')
    this.$socket.getBusinessCard(uid, res => {
      this.friend = res.response.data
      console.log(JSON.stringify(this.friend))
    })
  },
  methods: {
    handleAddFriend () {
      this.$socket.insertFriend(this.user.id, this.friend.id, res => {
        console.log('来了哟')
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
