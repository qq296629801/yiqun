<template>
<div class="s-canvas" @click.stop="handleClick">
  <canvas id="s-canvas" :width="contentWidth + 'px'" :height="contentHeight + 'px'"></canvas>
</div>
</template>

<script>
export default {
  name: 'VerificationCode',
  data () {
    return {
      pin: '',
      identifyCode: ''
    }
  },
  props: {
    fontSizeMin: { // 字体最小值
      type: Number,
      default: 20
    },
    fontSizeMax: { // 字体最大值
      type: Number,
      default: 20
    },
    backgroundColorMin: { // 验证码图片背景色最小值
      type: Number,
      default: 200
    },
    backgroundColorMax: { // 验证码图片背景色最大值
      type: Number,
      default: 220
    },
    dotColorMin: { // 背景干扰点最小值
      type: Number,
      default: 1
    },
    dotColorMax: { // 背景干扰点最大值
      type: Number,
      default: 1
    },
    contentWidth: { // 容器宽度
      type: Number,
      default: 100
    },
    contentHeight: { // 容器高度
      type: Number,
      default: 30
    }
  },
  methods: {

    // 处理点击事件
    handleClick () {
      this.randomVC()
    },

    // 随机生成验证码
    randomVC () {
      var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < arr.length; i++) {
        var end = arr.length - 1
        var index = (Math.random() * (end + 1)) >> 0
        var t = arr[end]
        arr[end] = arr[index]
        arr[index] = t
      }
      this.identifyCode = (arr.slice(0, 4))
      let str = ''
      this.identifyCode.forEach(s => {
        str += s
      })
      this.$emit('input', str)
    },

    // 生成一个随机数
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor (min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },

    drawPic () {
      let canvas = document.getElementById('s-canvas')
      let ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制随机背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制验证码
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },

    // 绘制验证码
    drawText (ctx, txt, i) {
      ctx.fillStyle = this.randomColor(50, 160) // 随机生成字体颜色
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei' // 随机生成字体大小
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-30, 30)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },

    // 绘制干扰线
    drawLine (ctx) {
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = this.randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },

    // 绘制干扰点
    drawDot (ctx) {
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  },
  watch: {
    identifyCode () {
      this.drawPic()
    }
  },
  created () {
    this.randomVC()
  }
}
</script>
<style lang="less">
  .s-canvas {
    height: 30px;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
