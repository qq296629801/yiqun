<template>
    <div class="user-set box-wrap">
        <div class="back-btn">
            <el-button icon="el-icon-back" type="text" @click="$router.push('/system/user')">用户编辑</el-button>
        </div>
        <main class="main-box">
            <info-set></info-set>
        </main>
    </div>
</template>
<script>
import InfoSet from './infoSet'
export default {
    name: 'ProjectSet',
    components: {
        InfoSet
    }
}
</script>
<style lang="less">
    .user-set {
        position: relative;
        padding: 0 !important;
        background: #f5f5f5 !important;
        .main-box {
            height: calc(100% - 36px);
            background: #fff;
            padding: 16px;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }
</style>
