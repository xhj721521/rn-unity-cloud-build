module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
          '@app': './src/app',
          '@modules': './src/modules',
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@screens': './src/screens',
          '@services': './src/services',
          '@bridge': './src/bridge',
          '@state': './src/state',
          '@store': './src/store',
          '@theme': './src/theme',
          '@locale': './src/locale',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
