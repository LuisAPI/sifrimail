module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: true,           // Optional: validate that the keys are present
          allowUndefined: false // Optional: disallow undefined variables
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
