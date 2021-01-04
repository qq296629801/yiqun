<template>
  <div class="mine-wrap">
    <div class="mine-top-box">
      <div class="info-img"><img :src="`${$url}/${user.avatar}`" alt=""></div>
      <div class="info-context">
        <span class="name">{{user.nickName}}</span>
        <span class="num">{{user.userName}}</span>
        <span class="edit">
          <i class="iconfont icon-jinbi"></i>
          <span class="num">{{user.money}}</span>
        </span>
      </div>
      <mt-cell is-link to="/createQrCode">
        <i slot="icon" class="iconfont icon-erweima" />
      </mt-cell>
    </div>
    <div>
      <mt-cell title="个人信息" is-link to="/peronInfo">
        <i slot="icon" class="iconfont icon-gerenxinxi"></i>
      </mt-cell>
      <mt-cell title="账户设置" is-link to="/accountSet">
        <i slot="icon" class="iconfont icon-shezhi"></i>
      </mt-cell>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Mine',
  data () {
    const user = localStorage.getItem('user')
    return {
      user: (user && JSON.parse(user)) || {}
    }
  },
  mounted () {
  }
}
</script>
<style lang="less">
  .mine-top-box .mint-cell .mint-cell-wrapper {
    background-image: -webkit-linear-gradient(top, #fff, #fff 50%, transparent 50%);
    background-image: linear-gradient(180deg, #fff, #fff 50%, transparent 50%);
  }
  .mine-wrap {
    margin-top: 10px;
    .icon-gerenxinxi {
      color: orange;
    }
    .icon-shezhi {
      color: #26a2ff;
    }
    .mine-top-box {
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
      .edit {
        display: flex;
        align-items: center;
        i {
          font-size: 20px;
        }
      }
      .info-context {
        margin-left: auto;
        margin-right: auto;
        width: 150px;
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        i {
          font-size: 18px;
          color: orange;
        }
      }
      .info-img {
        width: 64px;
        height: 64px;
        margin-left:20px;
        img{
          width: 100%;
          border-radius: 10px;
          height: 100%;
        }
      }
    }
  }
</style>
