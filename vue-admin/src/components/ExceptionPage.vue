<template>
    <div class="exception-page">
        <div class="img">
            <img :src="config[type].img" alt="">
        </div>
        <div class="con">
            <div class="title">{{config[type].title}}</div>
            <div class="desc">{{config[type].desc}}</div>
            <div>
                <el-button type="primary" @click="backToHome">返回首页</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ExceptionPage',
    props: {
        type: {
            type: String,
            default: '403'
        }
    },
    data () {
        return {
            config: {
                '403': {
                    img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
                    title: '403',
                    desc: '抱歉，你无权访问该页面'
                },
                '404': {
                    img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
                    title: '404',
                    desc: '抱歉，你访问的页面不存在'
                },
                '500': {
                    img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
                    title: '500',
                    desc: '抱歉，服务器出错了'
                }
            }
        }
    },
    methods: {
        backToHome () {
            this.$router.push('/')
        }
    }
}
</script>
<style lang="less" scoped>
    .exception-page {
        width: 100%;
        height: 100%;
        background: #f0f2f5;
        display: flex;
        .con, .img {
            width: 50%;
            height: 100%;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            padding-left: 50px;
            .title {
                margin-bottom: 24px;
                color: #434e59;
                font-weight: 600;
                font-size: 72px;
                line-height: 72px;
            }
            .desc {
                margin-bottom: 16px;
                color: rgba(0,0,0,.45);
                font-size: 20px;
                line-height: 28px;
            }
        }
        .img {
            justify-content: center;
            align-items: flex-end;
            padding-right: 50px;
            img {
                max-width: 430px;
                height: 360px;
                border: none;
            }
        }
        .con {
            align-items: flex-start;
        }
    }
</style>
