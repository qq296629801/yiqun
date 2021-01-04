<template>
  <div class="upload-img">
    <img class="avatar" :src="uploadData.imgUrl" alt>
    <input
      type="file"
      accept="image/*"
      class="fileimg"
      @change="updateImg($event)"
    >
  </div>
</template>
<script>
import lrz from 'lrz'
export default {
  name: 'UploadImg',
  props: {
    uploadData: {
      type: Object
    }
  },
  data () {
    const user = localStorage.getItem('user')
    return {
      user: (user && JSON.parse(user)) || {},
      // filterList: ['image/gif', 'image/jpeg', 'image/png', 'image/x-icon'],
      size: 0
    }
  },
  computed: {
    // 计算大小
    bySize () {
      if (this.size === 0) return '0 B'
      let k = 1024
      let sizes = ['B', 'KB', 'MB', 'GB']
      let i = Math.floor(Math.log(this.size) / Math.log(k))
      return (this.size / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    }
  },
  methods: {
    // 单文件上传
    updateImg (el) {
      if (!el.target.files[0].size) return
      this.filesList(el.target.files)
    },
    // 遍历图片列表
    filesList (files) {
      [...files].forEach((v) => this.fileAdd(v))
    },
    // 添加到渲染列表
    fileAdd (file) {
      this.size += file.size
      this.uploadData.imgUrl = file.src
      this.postData(file)
    },
    postData (file) {
      lrz(file, {
        width: 400,
        quality: 0.8
      })
        .then((rst) => {
          let formData = new FormData()
          formData.append('file', rst.file, rst.origin.name)
          this.$axios.post(this.uploadData.uploadUrl, formData).then(res => {
            if (res.data.success) {
              this.uploadData.imgUrl = `${this.$url}/${res.data.data}`
              this.$socket.updateAvatar(this.user.id, res.data.data, res => {
                if (res.success) {
                  localStorage.setItem('user', JSON.stringify(res.user))
                }
              })
            }
          })
          // 成功时执行
        }).catch((error) => {
          console.log(error)
        }).always(function () {
        // 不管成功或失败，都会执行
        })
    }
  }
}
</script>
<style lang="less">
.upload-img {
  overflow: hidden;
  position: relative;
  .fileimg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
