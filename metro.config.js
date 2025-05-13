// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable experimental features for Expo Router
  unstable_transformerConfig: {
    unstable_allowRequireContext: true,
  },
});

// Modify asset extensions
const { assetExts, sourceExts } = config.resolver;
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...sourceExts, 'svg'];

// Export the configuration
module.exports = config; 