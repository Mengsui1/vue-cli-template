const pack = require('./package.json');
module.exports = {
  transpileDependencies: [/.*vf-modal.*/],
  publicPath:
    process.env.VUE_APP_ENV === 'prod'
      ? `https://cdn2.h5no1.com/${pack.name}/`
      : './',
  css: {
    loaderOptions: {
      scss: {
        // 传入全局共享变量
        // additionalData
        // additionalData: `@import "~@/assets/css/index.scss"`
        // sass-loader v8.0.0+, use `data:` for elder version prependData
        additionalData: `@import "~@/assets/css/index.scss";`
      }
    }
  },
  lintOnSave: true,
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
    config.plugin('html').tap(args => {
      args[0].title = '种草鸭四期';
      return args;
    });
  }
};
