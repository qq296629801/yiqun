<template>
  <div class="home" :style="$route.name!=='登录' ? '' : 'padding-top:0;'">
    <mt-header fixed v-if="$route.name!=='登录'" :title="$route.name">
      <mt-button v-if="!filterComp.includes($route.name)" slot="left" @click="$router.go(-1)" icon="back">返回
      </mt-button>
      <mt-button v-if="['群聊天'].includes($route.name)" icon="more" slot="right"></mt-button>
    </mt-header>
    <router-view class="home-main" :style="getHeight()"></router-view>
    <mt-tabbar v-show="isShow" :fixed="true" v-model="active">
      <router-link class="my-tabs" v-for="(item, i) in tabList" :key="i" :to="item.path">
        <mt-badge class="my-badge" v-if="item.name === '聊天' && listLength!==0" size="small" type="error" color="red">
          {{ listLength>99?'99+':listLength }}
        </mt-badge>
        <mt-tab-item :id="i">
          <i slot="icon" :class="`iconfont ${item.icon}`"></i>{{item.name}}
        </mt-tab-item>
      </router-link>
    </mt-tabbar>
  </div>
</template>
<script>
import './common.less'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data () {
    const user = localStorage.getItem('user')
    return {
      filterComp: ['聊天', '联系人', '我的'],
      timer: null,
      user: (user && JSON.parse(user)) || null,
      active: 0,
      path: ['/chatList', '/contact', '/mine'],
      tabList: [
        { icon: 'icon-conversation_icon', path: '/chatList', name: '聊天', index: 0, num: 0 },
        { icon: 'icon-qunliao', path: '/contact', name: '联系人', index: 1 },
        { icon: 'icon-wode', path: '/mine', name: '我的', index: 2 }
      ]
    }
  },
  created () {
    this.$socket.open()
    this.getActive()
  },
  computed: {
    ...mapGetters({
      listLength: 'store/getListLength'
    }),
    isShow () {
      return this.path.includes(this.$route.path)
    }
  },
  methods: {
    getHeight () {
      return this.path.includes(this.$route.path) ? 'height:calc(100% - 55px);' : 'height:100%;'
    },
    getActive () {
      if (this.path.includes(this.$route.path)) {
        this.active = this.tabList.filter(v => v.name === this.$route.name)[0].index
      }
    }
  },
  load: {
    dom () {
    },
    plus: () => {
      if (window.isApp) {
        var firstBack = 0
        var handleBack = function () {
          var currentWebview = window.plus.webview.currentWebview()
          var now = Date.now || function () {
            return new Date().getTime()
          }
          currentWebview.canBack(function (evt) {
            if (currentWebview.id === window.plus.runtime.appid) {
              if (!firstBack) {
                firstBack = now()
                setTimeout(function () {
                  firstBack = 0
                }, 2000)
              } else if (now() - firstBack < 2000) {
                var main = window.plus.android.runtimeMainActivity()
                main.moveTaskToBack(false)
              }
            } else {
              // canBack: 查询Webview窗口是否可后退
              if (evt.canBack) {
                history.back()
              } else {
                currentWebview.close('auto')
              }
            }
          })
        }
        window.plus.key.addEventListener('backbutton', handleBack)
      }
    }
  }
}
</script>
<style lang="less">
  .mint-header {
    background: #fff;
    color: #000;
    border-bottom: 1px solid #c3c3c3;
  }
  .home {
    padding-top: 40px;
    height: 100%;
    .home-main {
      overflow-y: auto;
      overflow-x: hidden;
    }
    .mint-tabbar .is-selected {
      background: none;
    }
    .mint-tabbar {
      background: #1f1f1f;
      display: flex;
      justify-content: space-around;
      height: 55px;
      & > a {
        width: 15%;
        text-decoration: none;
        color: #cacaca;
      }
      .router-link-active {
        color: #26A2ff;
      }
    }
    .mint-tab-item-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 20px;
      }
    }
    .my-tabs {
      position: relative;
      .my-badge {
        position: absolute;
        top: 2px;
        right: 5px;
        padding: 0 6px;
      }
    }
  }
</style>
