<template>
  <div class="about-us">
    <div class="logo-box">
      <img class="logo" src="../../../assets/logo.png" alt="">
      <span class="logo-title">此软件</span>
      <span class="logo-version">version：{{version}}</span>
    </div>
    <div class="right-box">
      <span>易群公司版权所有</span>
      <span>copyright@2018-2019All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  data () {
    return {
      version: '2.6.0'
    }
  },
  mounted () {
    if (window.isApp) {
      window.plus.runtime.getProperty(window.plus.runtime.appid, (inf) => {
        this.version = inf.version
      })
    }
  },
  methods: {
  },
  load: {
    dom () {
    },
    plus: () => {
    }
  }
}
</script>
<style lang="less">
  .about-us {
    .logo {
      width: 70px;
      height: 70px;
    }
    .logo-box {
      padding-top: 85px;
    }
    .logo-title {
      color: #373737;
      font-size: 18px;
      margin-top: 20px;
      margin-bottom: 5px;
    }
    .logo-version {
      color: #373737;
      font-size: 16px;
    }
    .logo-box, .right-box {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .right-box {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0;
      padding-bottom: 45px;
      span {
        color: #999999;
        font-size: 12px;
      }
    }
  }
</style>
