module.exports = {
  publicPath: './',
  lintOnSave: true,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem')({ remUnit: 37.5 }) // 换算的基数
        ]
      }
    }
  },
  devServer: {
    port: 8089,
    host: '0.0.0.0',
    https: false,
    open: true
  }
}
