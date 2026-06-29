module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Module resolver — enables @/ imports from project root
      ['module-resolver', {
        root: ['./'],
        alias: { '@': './' },
        extensions: ['.ios.js','.android.js','.js','.jsx','.ts','.tsx','.json'],
      }],
    ],
  };
};
