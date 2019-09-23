const path = require('path')

module.exports = {
  watchOptions: {
    ignored: /node_modules/
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'script')]
  },
  resolve: {
    modules: [path.resolve('node_modules'), path.resolve('src')],
    alias: {
      '@': path.resolve('src'),
      'mobx-multiple-store': 'mobx-multiple-store/vue',
    },
  }
}
