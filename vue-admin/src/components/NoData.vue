<template>
<div class="no-data">
    <img :style="isExpImg ? 'width: 200px; height: 230px;' : ''" :src="isExpImg ? imgArray[2] : imgArray[Number(types)]" class="no-msg-img">
    <slot></slot>
</div>
</template>

<script>
export default {
    name: 'NoData',
    props: {
        types: {
            type: Boolean,
            default () {
                return false
            }
        },
        isExpImg: {
            type: Boolean,
            default () {
                return false
            }
        }
    },
    data () {
        return {
            imgArray: [require('../assets/img/nodata.png'), require('../assets/img/search_nodata.png'), require('../assets/img/noExp1.png')]
        }
    }
}
</script>

<style lang="less">
.no-data {
    width: 100%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .no-msg-img {
        width: 300px;
        padding-top: 50px;
    }
}
</style>
