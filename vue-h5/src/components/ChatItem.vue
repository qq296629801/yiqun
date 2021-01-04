<template>
<div class="chat-border">
  <mt-cell-swipe
    class="chat-item my-border"
    :right="[
        {
          content: '删除',
          style: { background: '#ef4f4f', color: '#fff'},
          handler: () => handleClickClear(item.id)
        }
    ]"
    @click.stop.native="$emit('toChat')">
    <div class="list-img">
      <img :src="`${$url}/${item.imgUrl}`" alt="" />
      <template v-if="item.unreadNumber !== 0">
        <mt-badge size="small" type="error" color="red">{{getNum(item.unreadNumber)}}</mt-badge>
      </template>
    </div>
    <div class="right-box">
      <div class="right-box-top">
        <span class="name">{{item.chatName}}</span>
        <span :ref="`charItem${index}time`" class="time" v-time="item.lastOpenTime"></span>
      </div>
        <div class="right-box-bot" v-if="item.msgType === 0">{{item.content}}</div>
        <div class="right-box-bot" v-else>[{{messageStr[item.msgType]}}]</div>
    </div>
  </mt-cell-swipe>
  </div>
</template>
<script>
export default {
  name: 'ChatItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      startX: 0,
      endX: 0,
      pianyiX: 0,
      messageStr: ['文字', '图片', '表情', '语音', '视频', '签到', '撤销', '发红包', '抢红包']
    }
  },
  methods: {
    handleClickClear (id) {
      this.$emit('clear', id)
    },
    getNum (num) {
      return num <= 100 ? num : '99+'
    }
  }
}
</script>
<style lang="less">
  .chat-item {
    margin-bottom: 1px;
    height: 80px;
    padding: 16px;
    display: flex;
    align-items: center;
    .mint-cell-wrapper {
      overflow: initial;
      background: none;
      padding: 0;
      .mint-cell-value {
        width: 100%;
      }
    }
    .mint-cell-swipe-button {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: initial;
    }
    .list-img {
      position: relative;
      width: 52px;
      height: 52px;
      margin-right: 12px;
      img {
        width: 52px;
        height: 52px;
        border-radius: 5px;
      }
      .mint-badge {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
        // padding: 0 6px;
      }
    }
    .right-box {
      width: calc(100% - 64px);
      height: 52px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .right-box-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          font-size: 15px;
          color: #000;
          overflow: hidden;
          width: calc(100% - 64px);
          text-align: left;
        }
        .time {
          font-size: 12px;
          color: #B6B6B6;
        }
      }
      .right-box-bot {
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #B6B6B6;
        font-size: 12px;
      }
    }
  }
</style>
