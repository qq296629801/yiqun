<template>
  <chat-main :chatType="1" :chat="chat"></chat-main>
</template>
<script>
import ChatMain from '@/components/ChatMain'
export default {
  name: 'GroupChatView',
  components: { ChatMain },
  data () {
    const chat = localStorage.getItem('groupChatItem')
    return {
      chat: (chat && JSON.parse(chat)) || {}
    }
  }
}
</script>
