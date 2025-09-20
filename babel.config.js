module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [

      [
        'module-resolver',
        {
          alias: {
            '@': './app',
            '@components': './components',
            '@constants': './constants',
            '@hooks': './hooks',
            '@utils': './utils'
          },
        },
      ],
      // Plugins necessários para funcionalidades modernas do JS
      '@babel/plugin-transform-export-namespace-from',
      '@babel/plugin-transform-optional-chaining',
      '@babel/plugin-transform-nullish-coalescing-operator',
      
  // O plugin do reanimated deve ser sempre o último
  'react-native-worklets/plugin',
    ],
  };
};