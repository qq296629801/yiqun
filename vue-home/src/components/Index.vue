<template>
  <div class="layout">
      <Carousel autoplay class="banner">
        <Carousel-item>
          <img src="../../static/banner/banner.jpg">
        </Carousel-item>
      </Carousel>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout .banner{
  height: 600px;
  border: 0;
  margin: 0;
  padding: 0;
}
.layout .banner img{
  width: 100%;
  height: 100%;
}
</style>
