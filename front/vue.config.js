module.exports = {
  outputDir: '../backend/static',
  devServer: {
    port: 5000,
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Photo&Studio';
      return args;
    });
  },
};
