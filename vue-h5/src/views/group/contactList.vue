<template>
  <div class="contact-list">
    <div class="form" >
      <mt-header fixed title="选择联系人">
        <mt-button slot="left" icon="back" @click="$router.go(-1)">返回</mt-button>
        <mt-button v-show="this.selectUsers.length === 0" slot="right" class="blue"  disabled="disabled">确定</mt-button>
        <mt-button class="blue" v-show="this.selectUsers.length !== 0" slot="right" @click="saveGroupMember" >
          确定({{this.selectUsers.length}})
        </mt-button>
      </mt-header>
      <mt-index-list>
        <mt-search class="search-box" v-model="chatName"></mt-search>
        <template v-for="(item, i) in list">
          <mt-index-section :index="item.name" v-bind:key="i" v-if="item.members.length>0">
            <template v-for="(u, i) in item.members">
              <mt-cell :key="i">
                <img :key="i" slot="icon" class="check-img" :src="`${$url}/${u.avatar}`" alt=""/>
                <mt-checklist :key="i" align="right" v-model="checkValue" :options="[{label: u.nickName, value: u, disabled: false}]" @change="checkClick($event)"></mt-checklist >
              </mt-cell>
            </template>
          </mt-index-section>
        </template>
      </mt-index-list>
    </div>
  </div>
</template>
<script>
export default {
  name: 'create',
  data () {
    const user = localStorage.getItem('user')
    const groupItem = localStorage.getItem('groupItem')
    const storage = localStorage.getItem('contacts')
    return {
      ids: [],
      defaultGroupNames: [],
      selectUsers: [],
      avatar: '',
      checkValue: [],
      show: true,
      fixedButton: '',
      count: 0,
      user: (user && JSON.parse(user)) || null,
      groupItem: (groupItem && JSON.parse(groupItem)) || null,
      chatName: '',
      list: (storage && JSON.parse(storage)) || [],
      search: []
    }
  },
  watch: {
    chatName (val) {
      this.list = this.search.filter(v => { return v.name.includes(val) })
    }
  },
  methods: {
    checkClick (e) {
      this.selectUsers = e
      this.selectUsers.forEach((item) => {
        this.ids.push(item.id)
      })
    },
    saveGroupMember () {
      this.$socket.joinGroup(this.groupItem.group.id, this.ids, this.user.userName, res => {
        if (res.success) {
          this.$router.push('/groupChat').then()
        }
      })
    },
    queryGuests () {
      this.$socket.listGuests(this.user.id, res => {
        this.list = res.response.data
        this.search = this.list
        localStorage.setItem('contacts', JSON.stringify(this.list))
      })
    }
  },
  mounted () {
    this.queryGuests()
  }

}
</script>

<style lang="less">
  .contact-list {
    .mint-header-title {
      vertical-align: middle;
      padding-top: 3px;
    }
    .mint-checklist .mint-checklist-label {
      width: 290px;
    }
    .mint-checklist .mint-cell-wrapper {
      background-image: -webkit-linear-gradient(top, #fff, #fff 50%, transparent 50%);
      background-image: linear-gradient(180deg, #fff, #fff 50%, transparent 50%);
    }
    .mint-indexsection .mint-cell-title .mint-checkbox-label {
      margin-left: -15px;
      font-size: 18px;
      letter-spacing: 1px;
      float: left;
    }
    .mint-indexsection .mint-cell-title {
      flex: none;
      -webkit-flex: none;
    }
    .mint-indexsection .mint-cell-wrapper {
      background-position-x: 45px;
    }
    .mint-search {
      height: auto;
      .mint-searchbar {
        background: #f6f7f8;
      }
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }
    .mint-indexsection {
      text-align: left;
    }
    .group {
      .form {
        .blue {
          background-color: #26a2ff;
          width: 80px;
          color: #fff;
          height: 30px;
        }
        .nav {
          width: 10%;
          align-items: center;
          justify-content: flex-start;
          flex-direction: column;
          flex-wrap: nowrap;
          margin-left: 10px;
          display: inline;
        }
      }
    }
  }
</style>
