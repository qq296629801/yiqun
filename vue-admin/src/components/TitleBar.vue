<template>
<div class="title-bar" :style="border?'border-bottom:1px solid #ebeef5':''">
    <span class="t-b-name">{{title}}</span>
    <slot name="item"></slot>
</div>
</template>

<script>
export default {
    name: 'TitleBar',
    props: {
        title: {
            type: String,
            required: true
        },
        border: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="less" scoped>
.title-bar {
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
