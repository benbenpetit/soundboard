module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.jsx', '.json', '.svg', '.png'],
          alias: {
            assets: './src/assets',
            components: './src/components',
            screens: './src/screens',
            utils: './src/utils',
            services: './src/services',
            reducers: './src/reducers',
          }
        }
      ]
    ]
  };
};
