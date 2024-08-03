module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?
    '/kpsc-cropper/' : '/',
  devServer: {
    disableHostCheck: true
  },
  pwa: {
    name: 'PSC Image Cropper',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  }
}