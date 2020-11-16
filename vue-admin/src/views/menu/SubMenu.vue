<template>
<div>
    <template v-if="menuMode && selfitem">
        <el-menu-item class="pre-menu-title" :key="`${index}-0`" :index="menuList[0].path">
            <!-- <i :class="selfitem.icon"></i> -->
            <span style="padding-left: 10px;" slot="title">{{selfitem.name}}</span>
        </el-menu-item>
    </template>
    <template v-for="(item, n) in menuList">
        <!-- 此菜单下还有子菜单 -->
        <el-submenu v-if="item.children" :key="`${index}-${n + 1}`" :data="item" :index="item.path">
            <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </template>
            <!-- 递归 -->
            <sub-menu :menuList="item.children"></sub-menu>
        </el-submenu>
        <!--一级菜单 -->
        <el-menu-item v-if="!item.children" :key="`${index}-${n + 1}`" :data="item" :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
        </el-menu-item>
    </template>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'SubMenu',
    props: {
        menuList: {
            require: true,
            type: Array
        },
        index: {
            require: true,
            type: Number
        },
        selfitem: {
            type: Object
        }
    },
    computed: {
        ...mapGetters({
            menuMode: 'common/getMenuMode'
        })
    }
}
</script>
<style lang="less">
    .pre-menu-title {
        font-size: 16px;
        line-height: 40px;
        height: 46px;
        border-bottom: 1px solid rgb(255, 255, 255);
    }
    .el-submenu__title {
        letter-spacing: 1px;
    }
    .el-menu-item {
        letter-spacing: 1px;
        span {
            display: inline-block;
            transition: all .3s;
        }
        &:hover {
            span {
                transform: translateX(10px);
            }
        }
    }
</style>
