<template>
<div class="base-container">
    <el-container>
        <el-aside :width="!menuMode?'200px':'48px'">
            <nav-menu></nav-menu>
            <el-button class="menuModelSwitch" @click="toggleMenuMode" :icon="!menuMode?'iconfont icon-liebiaoshousuo-copy1':'iconfont icon-liebiaozhankai1-copy1'"></el-button>
        </el-aside>
        <el-container>
            <el-header>
                <head-nav></head-nav>
            </el-header>
            <el-main>
                <!-- <bread-crumb></bread-crumb> -->
                <div class="wrap">
                    <router-view />
                </div>
            </el-main>
        </el-container>
    </el-container>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import NavMenu from '@/views/menu/NavMenu'
import HeadNav from '@/views/menu/HeadNav'
import { changeWindowSize } from '@/js/tool'
// import BreadCrumb from '@/views/menu/BreadCrumb'
export default {
    name: 'container',
    computed: {
        ...mapGetters({
            menuMode: 'common/getMenuMode'
        })
    },
    components: {
        NavMenu,
        HeadNav
        // BreadCrumb
    },
    methods: {
        ...mapMutations({
            setMenuMode: 'common/setMenuMode'
        }),
        toggleMenuMode () {
            let toggleValue = !this.menuMode
            this.setMenuMode(toggleValue)
            if (['/home'].includes(this.$route.path)) {
                changeWindowSize()
            }
        }
    }
}
</script>

<style lang="less">
.base-container {
    width: 100%;
    height: 100%;
    .menuModelSwitch {
        position: relative;
        background-color: transparent;
        border: 0;
        min-width: 0;
        color: #fff;
    }
    .el-main {
        overflow: hidden;
        padding: 16px;
        background: #f5f5f5;
        .wrap {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            & > div {
                overflow: hidden;
                padding: 16px;
                background: #fff;
                border-radius: 4px;
            }
            .self-background {
                overflow: inherit;
                background: #f5f5f5;
                padding: 0;
            }
        }
    }
    .el-breadcrumb {
        padding-bottom: 8px;
    }

    .el-header {
        text-align: center;
        height: 48px !important;
        line-height: 48px;
    }

    .el-aside {
        overflow-x: hidden;
        text-align: center;
        line-height: 200px;
        background: #001A2E;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .el-container,
    .el-menu {
        width: 100%;
        height: 100%;
        border-right: none;
    }
}
</style>
