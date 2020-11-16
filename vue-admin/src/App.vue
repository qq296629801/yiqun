<template>
<div id="app">
    <water-mark v-if="$route.path !== '/login'"></water-mark>
    <router-view />
</div>
</template>
<script>
import WaterMark from '@/components/WaterMark'
export default {
    name: 'App',
    components: { WaterMark }
}
</script>
<style lang="less">
@import './common.less';
#app {
    width: 100%;
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
