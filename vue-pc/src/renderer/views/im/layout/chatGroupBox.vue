<template>
  <div class="chat-panel">
    <div class="chat-box-list">
      <Input clearable prefix="ios-search" clearable v-model="search" placeholder="搜索" size="small" class="search"/>
      <div class="group-box">
        <ul class="user-list">
          <li class="user" v-for="group in items">
            <a href="javascript:" @click="showChat(group)">
              <img :src="`${$url}/${ group.avatar || group.imgUrl }`" />
              <b>{{ group.remarkName || group.groupNickName || group.chatName }}</b>
              <p>{{ group.lastOperTime | dateFormat }}</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="chat-box">
      <Top></Top>
      <Chat @showChat="showChat" v-if="chat"></Chat>
      <Welcome v-else></Welcome>
    </div>
  </div>
</template>
<script>
import Top from '../components/top.vue';
import Chat from '../components/chat.vue';
import Welcome from '../components/welcome.vue';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  components: {
    Top,
    Chat,
    Welcome
  },
  filters: {
      dateFormat(val) {
          return moment(Number(val)).calendar();
      }
  },
  computed: {
    groups: {
      get: function() {
        return this.$store.state.groups;
      },
      set: function(groups) {
        this.$store.commit('setGroups', groups);
        this.items=groups;
      }
    },
    chat:{
        get:function () {
            return this.$store.state.chat;
        },
        set:function (chat) {
            this.$store.commit('setChat', chat);
        }
    },
    chatType: {
        get: function() {
            return this.$store.state.chatType;
        },
        set: function(chatType) {
            this.$store.commit('setChatType',chatType);
        }
    }
  },
  data() {
    return {
      search: '',
      user: this.$store.state.user,
      items: this.$store.state.groups
    };
  },
  watch: {
    search (val) {
      const list = this.$store.state.groups
      this.items = val ? list.filter(item => {
        const { remarkName, groupNickName, chatName } = item
        const str = remarkName || groupNickName || chatName
        return str.includes(val)
      }) : list
    }
  },
  created() {
      this.$socket.getGroups('', this.user.operId, (result) => {
          if (result.response.success){
              this.groups = result.response.data
          }
      })
  },
  methods: {
    showChat: function(group) {
      this.chat = group
      this.chatType = 1
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../../../static/styles/theme';

.ivu-tabs-content {
  height: 100%;
}
.search {
  margin: 30px 20px;
  width: calc(100% - 40px);
}
.chat-panel {
  width: 26rem;
  background-color: $color-light-gray;
  height: 100%;
  display: flex;
  flex-direction: row;

  .chat-box {
    flex: 1;
    background-color: $color-box-bg;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .chat-box-list {
    height: 100%;
    width: 22rem;
    display: flex;
    flex-direction: column;
  }
}

.group-box {
  height: 100%;
  overflow: auto;

  .count {
    color: #aaaaaa;
  }

  li {
    list-style: none;
    position: relative;
    font-size: 1.2rem;
    cursor: pointer;
    font-weight: 200;
    margin-bottom: 2rem;

    h5 {
      padding: 0.5rem 0;
      cursor: pointer;
      font-size: 1.3rem;
      font-weight: 200;

      i {
        vertical-align: baseline;
      }
    }

    img {
      width: 4.4rem;
      height: 4.4rem;
      position: absolute;
      top: 0.4rem;
      left: 2rem;
    }

    b {
      position: absolute;
      font-size: 1.3rem;
      left: 7.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
      top: 0.6rem;
    }

    p {
      position: absolute;
      left: 7.5rem;
      bottom: 0.4rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 75%;
      font-size: 1.1rem;
      color: #aaaaaa;
    }
  }
  .active {
    background-color: $color-gray !important;
  }
  .user {
    height: 5.2rem;
    position: relative;

    a {
      display: block;
      width: 100%;
      height: 100%;
      color: $color-default;
      position: relative;

      i {
        display: inline-block;
        width: 1.8rem;
        height: 1.6rem;
        background-color: #ff0000;
        border-radius: 50%;
        color: $color-write;
        text-align: center;
        font-style: normal;
        position: absolute;
        left: 1rem;
        top: 0;
        z-index: 99999999999;
      }

      p {
        width: 12rem;
      }
    }
  }
}
</style>
