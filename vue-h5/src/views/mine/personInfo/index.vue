<template>
  <div class="person-info">
    <mt-cell title="头像" is-link>
      <upload-img :uploadData="uploadData"></upload-img>
    </mt-cell>
    <mt-cell title="昵称" :to="'/editName/0'" is-link :value="user.nickName"></mt-cell>
    <mt-cell title="二维码" slot="icon" :to="'/createQrCode'" is-link></mt-cell>
    <mt-cell title="修改密码" :to="'/changePwd/0'" is-link></mt-cell>
  </div>
</template>
<script>
import UploadImg from '@/components/UploadImg'

export default {
  name: 'PeronInfo',
  components: { UploadImg },
  data () {
    const user = localStorage.getItem('user')
    const $url = this.$url
    return {
      codeValue: '',
      user: (user && JSON.parse(user)) || null,
      uploadData: {
        imgUrl: '', // 图片地址
        uploadUrl: `${$url}/file/upload` // 上传图片的地址
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.uploadData.imgUrl = `${this.$url}/${this.user.avatar}`
    }

  }
}
</script>
<style lang="less">
.person-info {
  margin-top: 10px;
}

</style>
