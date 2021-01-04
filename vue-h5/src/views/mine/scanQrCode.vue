<template>
  <div></div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'ScanQrCode',
  props: {
    uploadData: {
      type: Object
    }
  },
  data () {
    return {
      time: 0,
      timer: null,
      isRecording: false,
      barcode: null
    }
  },
  load: {
    plus: () => {
    }
  },
  ...mapMutations({
    setCard: 'store/setCard'
  }),
  ...mapGetters({
    getCard: 'store/getCard'
  }),
  mounted () {
    if (!this.barcode) {
      this.barcode = window.plus.barcode.create('barcode', [window.plus.barcode.QR], {
        top: '50px',
        left: '0px',
        width: '100%',
        height: '500px',
        position: 'static'
      })
      this.barcode.onmarked = (type, result) => {
        localStorage.setItem('uid', result)
        this.$router.push('/businessCard').then()
        console.log('Success: type=' + type + ', result=' + result)
      }
      window.plus.webview.currentWebview().append(this.barcode)
    }
    this.barcode.start()
  },
  destroyed () {
    this.barcode.close()
  },
  methods: {
  }
}
</script>

<style lang="less">
  .recorder {
    color: #828282;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
