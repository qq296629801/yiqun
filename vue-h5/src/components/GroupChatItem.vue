<template>
  <div class="group-chat-item my-border" @click="$emit('toChat')">
    <img :src="`${$url}/${ item.avatar || item.imgUrl }`" alt="">
    <div class="right-box" v-if="!isHistory">{{item.remarkName || item.groupNickName || item.chatName}}</div>
    <div class="right-box" v-else>
      <div class="right-box-history">{{item.chatName}}<span>{{item.chatName}}</span></div>
      {{ item.chatName}}
    </div>
  </div>
</template>
<script>
export default {
  name: 'GroupChatItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isHistory: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    keywords: {
      type: String
    }
  },
  watch: {
    keywords (val) {
      console.log(val)
    }
  }
}
</script>
<style lang="less">
  .group-chat-item {
    height: 80px;
    padding: 16px;
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    background: white;
    img {
      width: 52px;
      height: 52px;
      border-radius: 5px;
      margin-right: 12px;
    }
    .right-box {
      width: calc(100% - 64px);
      height: 52px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 15px;
      color: #000;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .right-box-history {
        display: flex;
        justify-content: space-between;
        color: #A8BBD1;
      }
    }
  }
</style>
