module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import'),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5'
    }),
    require('postcss-px2upx')({
      baseDpr: 2,
      upxUnit: 1
    }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss')
  ]
}
