<template>
  <div class="mint-cell mint-field is-nolabel recorder" @touchstart.prevent="touchstart" @touchend.prevent="touchend">{{isRecording ? '松开 结束' : '按住 说话'}}</div>
</template>

<script>
import {
  Indicator,
  Toast
} from 'mint-ui'
export default {
  name: 'Recorder',
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
      recorder: null
    }
  },
  load: {
    plus: function () {
      window.plus.io.resolveLocalFileSystemURL('_doc/', function (entry) {
        entry.getDirectory('audio', { create: true }, function (dir) {
        }, function (e) {
        })
      }, function (e) {
      })
      this.recorder = window.plus.audio.getRecorder()
      if (this.recorder) {
        this.recorder.record({ filename: '_doc/test/' }, (path) => {
        }, function (e) {
        })
        setTimeout(this.stopRecord, 500)
      }
    }
  },
  methods: {
    clearTime () {
      clearInterval(this.timer)
      this.timer = null
    },
    upload (path) {
      if (this.time < 1) {
        Toast('您的说话时间太短')
      } else {
        var task = window.plus.uploader.createUpload(`${this.$url}/file/upload`,
          { method: 'POST' },
          (t) => { // 上传完成
            let res = JSON.parse(t.responseText)
            if (res.success) {
              let data = JSON.stringify({
                time: this.time,
                url: res.data
              })
              this.$emit('file', data)
            } else {
              Toast('添加失败：' + status + t)
            }
          }
        )
        task.addFile(path, { key: 'file' })
        task.start()
      }
    },
    // 录制短语音
    startRecord () {
      this.recorder = window.plus.audio.getRecorder()
      if (this.recorder) {
        this.recorder.record({ filename: '_doc/audio/', format: 'aac' }, (path) => {
          window.plus.io.resolveLocalFileSystemURL(path, (entry) => {
            this.upload(path)
          }, function (e) {
          })
        }, function (e) {
        })
      }
    },
    // 停止录制
    stopRecord () {
      if (this.recorder) {
        this.recorder.stop()
        this.recorder = null
      }
      this.clearTime()
    },
    // 录音开始
    touchstart () {
      this.isRecording = true
      Indicator.open({
        text: '录音中...',
        spinnerType: 'fading-circle'
      })
      this.time = 0
      this.timer = setInterval(() => {
        this.time++
      }, 1000)
      this.startRecord()
    },
    // 录音结束
    touchend () {
      this.isRecording = false
      Indicator.close()
      if (this.time < 1) {
        Toast('您的说话时间太短')
      }
      this.stopRecord()
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
