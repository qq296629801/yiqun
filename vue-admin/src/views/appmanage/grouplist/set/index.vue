<template>
    <div class="project-set box-wrap">
        <div class="back-btn">
            <el-button icon="el-icon-back" type="text" @click="$router.push('/groupList')">{{projectName}}</el-button>
        </div>
        <main class="main-box">
            <el-tabs v-model="activeName">
                <el-tab-pane v-for="(item, i) in componentIds" :key="i" :label="item.label" :name="`${i}`">
                    <component v-if="`${i}`===activeName" :is="item.componentId"></component>
                </el-tab-pane>
            </el-tabs>
        </main>
    </div>
</template>
<script>
import InfoSet from './infoSet'
import Member from './member'
export default {
    name: 'ProjectSet',
    data () {
        const projectName = JSON.parse(localStorage.getItem('groupInfo')).groupName
        return {
            activeName: '0',
            componentIds: [
                { label: '基本设置', componentId: InfoSet },
                { label: '成员管理', componentId: Member }
            ], // 由于没有相关API可以设置tab间间隔，且css控制会导致底部动画出错，所以使用空对象做占位符
            projectName
        }
    }
}
</script>
<style lang="less">
    .project-set {
        position: relative;
        padding: 0 !important;
        background: #f5f5f5 !important;
        .main-box {
            height: calc(100% - 36px);
            background: #fff;
            padding: 16px;
            .el-tabs {
                height: 100%;
                .el-tabs__nav-wrap::after {
                    height: 1px;
                    bottom: 1px;
                }
                .el-tabs__nav {
                    transform: translateX(22px) !important;
                    .el-tabs__item {
                        color: rgba(51, 51, 51, .65);
                        height: auto;
                    }
                    .is-active {
                        color: #000 !important;
                    }
                }
            }
            .el-tabs__content {
                height: calc(100% - 55px);
                overflow-x: hidden;
                overflow-y: auto;
                .el-tab-pane {
                    height: 100%;
                }
            }
        }
    }
</style>
