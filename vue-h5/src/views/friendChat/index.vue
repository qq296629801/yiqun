<template>
  <chat-main :chatType="0" :chat="chat"></chat-main>
</template>
<script>
import ChatMain from '@/components/ChatMain'
export default {
  name: 'FriendChatView',
  components: { ChatMain },
  data () {
    const chat = localStorage.getItem('friendChatItem')
    return {
      chat: (chat && JSON.parse(chat)) || {}
    }
  }
}
</script>
