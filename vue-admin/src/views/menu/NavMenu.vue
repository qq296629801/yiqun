<template>
<div class="nav-menu">
    <div class="logo-box" @click="goHome">
        <img src="../../assets/img/ic_launcher.png"/>
    </div>
    <el-menu :collapse-transition="false" :collapse="menuMode" router :default-active="$route.path" background-color="#001A2E" text-color="#fff" active-text-color="#fff">
        <template v-for="(item, i) in menuList">
            <!-- 此菜单下还有子菜单 -->
            <el-submenu v-if="item.children" :key="i" :index="item.path">
                <template slot="title">
                    <i :class="`side-icon ${item.icon} ${menuMode ? 'side-icon-1' : ''}`"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <!-- 递归 -->
                <sub-menu :menuList="item.children" :selfitem="item" :index="i"></sub-menu>
            </el-submenu>
            <!--一级菜单 -->
            <el-menu-item v-if="!item.children&&!item.hidden" :key="i" :index="item.path">
                <i :class="`side-icon ${item.icon} ${menuMode ? 'side-icon-1' : ''}`"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</div>
</template>

<script>
import SubMenu from './SubMenu'
import { mapGetters } from 'vuex'
export default {
    name: 'NavMenu',
    components: {
        SubMenu
    },
    computed: {
        ...mapGetters({
            menuList: 'common/getMenuList',
            menuMode: 'common/getMenuMode'
        })
    },
    methods: {
        goHome () {
            this.$router.push('/monitor/onlineUser')
        }
    }
}
</script>

<style lang="less">
.nav-menu {
    .is-active {
        background: #2680EB !important;
    }
    .side-icon {
        margin-right: 12px;
        display: inline-block;
        height: 18px;
        line-height: 18px;
        width: 20px;
        font-size: 20px;
    }
    .side-icon-1 {
        margin-right: 0;
    }
    .logo-box {
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img {
            height: 28px;
        }
    }

    .menu-title {
        line-height: 14px;
    }
    .el-menu--collapse {
        .el-tooltip, .el-submenu__title {
            display: flex !important;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
