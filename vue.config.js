const path = require('path')

process.env.VUE_APP_IPV4 = require('address').ip()

module.exports = {
  configureWebpack: require('./webpack.config'),
  devServer: {
    port: process.env.PORT
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      'patterns': [
        path.resolve('src/styles/colors.less'),
      ]
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('style-vw-loader')
      .loader('style-vw-loader')
      .options({
        viewportWidth: 50,
        unitPrecision: 2,
        viewportUnit: 'upx',
        fontViewportUnit: 'upx',
      })

    config.module
      .rule('compile')
      .test(/@dcloudio.+\.js$/)
      .use('uni-loader')
      .loader('uni-loader')
  }
}
