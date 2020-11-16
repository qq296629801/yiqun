<template>
<div class="bread-crumb">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, i) in list" :key="i" :to="{ path: item.path }">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
</div>
</template>

<script>
export default {
    name: 'BreadCrumbs',
    data () {
        return {
            list: []
        }
    },
    watch: {
        $route () {
            this.init()
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.list = this.$route.matched.filter(v => v.path && v.path !== '/home')
        }
    }
}
</script>
