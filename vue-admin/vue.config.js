module.exports = {
    publicPath: './',
    productionSourceMap: false,
    lintOnSave: false,
    runtimeCompiler: false,
    devServer: {
        port: 8088,
        host: 'localhost',
        https: false,
        open: true,
        proxy: {
            '/': {
                target: 'http://120.27.95.106:9998/',
                ws: false,
                changeOrigin: true,
                xfwd: false
            }
        }
    },
    configureWebpack: {
        plugins: [],
        performance: {
            hints: false
        }
    }
}
