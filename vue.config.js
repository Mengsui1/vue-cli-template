const pack = require('./package.json');
module.exports = {
  publicPath:
    process.env.VUE_APP_ENV === 'prod'
      ? `https://cdn2.h5no1.com/${pack.name}/`
      : './',
  css: {
    loaderOptions: {
      scss: {
        // 传入全局共享变量
        // additionalData
        // sass-loader v8.0.0+, use `data:` for elder version
        // prependData: `@import "~@/assets/css/index.scss";`,
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => {
        options.limit = 1;
        return options;
      });
    config.module
      .rule('media')
      .use('url-loader')
      .tap(options => {
        options.limit = 1;
        return options;
      });
  }
};
