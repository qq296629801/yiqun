<template>
  <div>
    <mt-header fixed :title="'二维码名片'">
      <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
    </mt-header>
    <div id="qrcode" position="middle"></div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'

export default {
  name: 'createCode',
  data () {
    const user = localStorage.getItem('user')
    return {
      user: (user && JSON.parse(user)) || {},
      qrcode: null
    }
  },
  mounted () {
    this.qrcode = new QRCode('qrcode', {
      width: 300,
      height: 300,
      text: this.user.id,
      colorDark: '#000',
      colorLight: '#fff',
      correctLevel: QRCode.CorrectLevel.Q
    })
  },
  methods: {
  }
}
</script>
<style lang="less">
  #qrcode {
    display: inline-block;
    margin-top: 10px;
    img {
      width: 300px;
      height: 300px;
      background-color: #fff;
      padding: 6px; // 挤出白边
    }
  }
</style>
