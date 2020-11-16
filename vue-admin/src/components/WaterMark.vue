<template>
    <div class="water-mark">
        <canvas ref="canvas" />
    </div>
</template>

<script>

export default {
    name: 'WaterMark',
    mounted () {
        this.init()
    },
    methods: {
        init () {
            let $canvas = this.$refs.canvas
            let ctx = $canvas.getContext('2d')
            $canvas.width = window.innerWidth
            $canvas.height = window.innerHeight
            ctx.font = 'lighter 20px Arial'
            ctx.fillStyle = '#ccc'
            this.ctx = ctx
            this.$canvas = $canvas
            this.draw()
        },
        draw () {
            let { ctx, $canvas } = this
            let { width, height } = $canvas
            if (!ctx) return
            ctx.clearRect(0, 0, width, height)
            const user = localStorage.getItem('USER')
            const text = (user && JSON.parse(user).username) || ''
            for (let i = -width; i < width; i += 400) {
                for (let j = 0; j < height * 1.5; j += 200) {
                    let x = Math.floor(j / 100) * 100
                    x = x % 400 === 0 ? 200 : 0
                    ctx.save()
                    ctx.rotate(-20 * Math.PI / 180)
                    ctx.fillText(text, i + x, j + 120)
                    ctx.restore()
                }
            }
            ctx.clearRect(0, 0, width, 50)
        }
    }
}
</script>

<style lang="less">
.water-mark {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: .2;
    z-index: 999999;
    position: fixed;
    pointer-events: none;
}
</style>
