const path = require('path')
module.exports = {
    outputDir: "dist", //打包后生成的文件名(默认dist)
    lintOnSave: true, //是否使用eslint
    devServer: {
        host: '0.0.0.0',
        open: true, // 是否自动打开浏览器页面
        port: 8888, // 端口地址
        https: false, // 使用https提供服务
        proxy: {
            '/self': {
                target: 'http://172.16.70.72:3000',
                changeOrigin: true,
                pathRewrite: { '^/self': '' }
            },
        }
    },
    /* 设置为compiler（模板），组件定义时就可以写'template' */
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                '@pub': path.resolve('public'),
                '@com': path.resolve('src/components'),
            }
        },
    }
}