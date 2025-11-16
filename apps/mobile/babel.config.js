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
          '@mock': './src/mock',
          '@services': './src/services',
          '@bridge': './src/bridge',
          '@state': './src/state',
          '@store': './src/store',
          '@theme': './src/theme',
          '@data': './src/data',
          '@locale': './src/locale',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
