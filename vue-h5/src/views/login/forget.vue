<template>
  <div class="cus-service">
    <template v-for="(item) in csList">
      <div v-bind:key="item.type" class="item">{{item.type}} {{item.phone}}</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'forget',
  data () {
    const user = localStorage.getItem('user')
    return {
      user: (user && JSON.parse(user)) || null,
      csList: []
    }
  },
  methods: {
    getCsList () {
      this.$socket.getCustomerServiceList('5f6d9d98', res => {
        this.csList = res.csList
        console.log(res)
      })
    }
  },
  created () {
    this.getCsList()
  }
}
</script>

<style lang="less">
.cus-service {
  margin-top: 10px;
  background: white;
  font-size: 15px;
  .item {
    margin-top: 10px;
  }
  .type {
    color: #999999;
  }
}
</style>
