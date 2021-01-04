<template>
  <div
    class="mint-cell mint-field is-nolabel recorder"
    @mouseup="touchend"
    @mousedown="mousestart"
    @touchstart.prevent="touchstart"
    @touchend.prevent="touchend">
    {{isRecording ? '松开 结束' : '按住 说话'}}
  </div>
</template>
<script>
import Recorderx, { ENCODE_TYPE } from 'recorderx'
import { Indicator } from 'mint-ui'

export default {
  name: 'Recorder',
  props: {
    uploadData: {
      type: Object
    }
  },

  data () {
    return {
      recorder: null,
      isRecording: false,
      time: 0,
      timer: null
    }
  },
  methods: {
    // 录音开始
    touchstart: function () {
      const audio = new Audio()
      this.recorder = new Recorderx()
      this.recorder.start(res => {
        if (!res) {
          alert('采样失败')
        }
      }).then(stream => {
        audio.srcObject = stream
      }).catch(error => alert(error))

      this.isRecording = true
      Indicator.open({
        text: '录音中...',
        spinnerType: 'fading-circle'
      })
      this.time = 0
      this.timer = setInterval(() => {
        this.time++
      }, 1000)
    },
    mousestart: function () {
      const audio = new Audio()
      this.recorder = new Recorderx()
      this.recorder.start(res => {
        if (!res) {
          alert('采样失败')
        }
      }).then(stream => {
        audio.srcObject = stream
      }).catch(error => alert(error))
      this.isRecording = true
      this.time = 0
      this.timer = setInterval(() => {
        this.time++
      }, 1000)
    },
    // 录音结束
    touchend: function () {
      this.isRecording = false
      Indicator.close()
      clearInterval(this.timer)
      this.timer = null
      try {
        const blob = this.recorder.getRecord({
          encodeTo: ENCODE_TYPE.WAV,
          compressible: true
        })
        this.postData(blob)
      } catch (error) {
        console.log(error)
      }
    },
    postData (blob) {
      let formData = new FormData()
      formData.append('file', blob, 'test.wav')
      this.$axios.post(this.uploadData.uploadUrl, formData).then(res => {
        if (res.data.success) {
          let data = JSON.stringify({ time: this.time, url: res.data.data })
          this.$emit('file', data)
        }
      })
    }
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
