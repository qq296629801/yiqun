<template>
  <div class="account-set">
    <mt-cell title="账户记录" is-link to="/pointRecords"></mt-cell>
    <mt-cell title="关于我们" is-link to="/aboutUs"></mt-cell>
    <mt-cell title="联系客服" is-link to="/forget"></mt-cell>
    <mt-cell title="检查更新" @click.native="checkUpdate" is-link></mt-cell>
    <mt-cell title="退出账号" @click.native="logout" is-link></mt-cell>
  </div>
</template>
<script>
import axios from 'axios'
import { Indicator, Toast } from 'mint-ui'
export default {
  name: 'FriendChat',
  methods: {
    logout () {
      localStorage.removeItem('chatList')
      localStorage.removeItem('groupChatItem')
      localStorage.removeItem('friendChatItem')
      localStorage.removeItem('groupList')
      localStorage.removeItem('userItem')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    checkUpdate () {
      if (!window.isApp) {
        axios.get('http://www.qm11.co/checkVersion').then((response) => {
          let download = response.data.data
          window.location.href = download.pc
        }).catch((error) => {
          console.log(error)
        })
      } else {
        checkService()
      }
      function checkService () {
        Indicator.open({
          text: '检测更新中...',
          spinnerType: 'fading-circle'
        })
        var xhr = new window.plus.net.XMLHttpRequest()
        xhr.onreadystatechange = function () {
          switch (xhr.readyState) {
            case 4:
              if (xhr.status === 200) {
                let res = JSON.parse(xhr.responseText)
                if (res.success) {
                  window.plus.runtime.getProperty(window.plus.runtime.appid, (inf) => {
                    if (inf.version !== res.data.version) {
                      if (window.plus.os.name === 'iOS') {
                        window.plus.runtime.openURL(res.data.ios)
                      } else if (window.plus.os.name === 'Android') {
                        downLoad(res.data.android)
                      }
                    } else {
                      Toast('暂无更新')
                      Indicator.close()
                    }
                  })
                }
              }
              break
            default :
              break
          }
        }
        xhr.open('GET', 'http://www.qm11.co/checkVersion')
        xhr.send()
        Indicator.close()
      }
      function downLoad (wgtUrl) {
        Indicator.open({
          text: '下载安装包...',
          spinnerType: 'fading-circle'
        })
        window.plus.downloader.createDownload(wgtUrl, { filename: '_doc/yiqun/download/', force: true }, function (d, status) {
          if (status === 200) {
            install(d)
          } else {
            Toast('下载失败')
          }
          Indicator.close()
        }).start()
      }
      function install (d) {
        Indicator.open({
          text: '安装中...',
          spinnerType: 'fading-circle'
        })
        window.plus.runtime.install(d.filename, { force: true }, function () {
          Indicator.close()
          Toast('应用软件安装完成')
          window.plus.runtime.restart()
        }, function (e) {
          Indicator.close()
          Toast('安装失败' + e.message)
        })
      }
    }
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
  .account-set {
    margin-top: 10px;
    .mint-button--default {
      background: transparent;
      border: 0;
      box-shadow: 0 0 0 transparent
    }
  }
</style>
