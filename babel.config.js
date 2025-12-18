module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // WatermelonDB decorators plugin - must be first
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv', {
      'moduleName': 'react-native-dotenv',
      'path': '.env',
    }],
  ],
};
