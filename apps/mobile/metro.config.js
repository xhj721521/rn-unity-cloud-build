const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = Array.from(
  new Set([...(config.resolver?.sourceExts ?? []), 'ts', 'tsx']),
);

module.exports = config;
