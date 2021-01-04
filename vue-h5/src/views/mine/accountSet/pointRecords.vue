<template>
  <div class="point-records">
    <mt-loadmore :top-method="loadTop" ref="loadmore">
      <mt-cell v-for="(item, i) in list" :key="i" :title="item.name" :label="item.operTime" :value="item.money"></mt-cell>
    </mt-loadmore>
  </div>
</template>
<script>
export default {
  name: 'PointRecords',
  data () {
    const user = localStorage.getItem('user')
    return {
      pageNum: 1,
      user: (user && JSON.parse(user)) || null,
      list: []
    }
  },
  mounted () {
    this.getMoneysByCondition()
  },
  methods: {
    loadTop () {
      this.pageNum = this.pageNum + 1
      this.$socket.getMoneys(this.user.id, this.pageNum, (res) => {
        res.moneyList.forEach(m => {
          if (!this.list.map(v => v.id).includes(m.id)) {
            this.list.push(this.money(m))
          }
        })
        this.list.sort((a, b) => {
          return a.id - b.id
        })
        console.log(res.moneyList)
      })
      this.$refs.loadmore.onTopLoaded()
    },
    getMoneysByCondition () {
      this.$socket.getMoneys(this.user.id, this.pageNum, (res) => {
        res.moneyList.forEach(m => {
          this.list.unshift(this.money(m))
        })
      })
    },
    money (m) {
      return {
        id: m.id,
        name: m.name,
        operTime: this.$moment(m.operTime).format('YYYY-MM-DD HH:mm'),
        money: (m.oper === 0 ? '+' + m.money : '-' + m.money) + '$'
      }
    }
  }
}
</script>
<style lang="less">
  .point-records {
    margin-top: 10px;
    height: 100%;
    .mint-cell-title {
      flex-direction: column;
      align-items: flex-start;
    }
    .mint-loadmore {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>
