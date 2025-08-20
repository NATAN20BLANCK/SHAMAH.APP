const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  env.mode = 'development';
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAllowSynchronousDefaultImport: true,
      },
      web: {
        build: {
          babel: {
            include: [
              path.resolve('node_modules/react-native-reanimated'),
              path.resolve('node_modules/react-native-gesture-handler'),
            ]
          }
        }
      }
    },
    argv
  );

  // Adicionar configurações para resolver CORS
  config.devServer = {
    ...config.devServer,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  };

  // Resolver aliases
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, './'),
    '@/components': path.resolve(__dirname, './components'),
    '@/constants': path.resolve(__dirname, './constants'),
    '@/hooks': path.resolve(__dirname, './hooks'),
    '@/utils': path.resolve(__dirname, './utils'),
    '@/services': path.resolve(__dirname, './services'),
  };

  // Fallbacks para módulos Node.js e APIs do navegador
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    net: false,
    tls: false,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    url: require.resolve('url'),
    assert: require.resolve('assert'),
  };

  // Injetar polyfills no bundle
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-web': path.resolve(__dirname, 'node_modules/react-native-web'),
  };
  
  // Adicionar script de inicialização
  config.entry = {
    app: [
      path.resolve(__dirname, 'global.js'),
      ...(Array.isArray(config.entry) ? config.entry : [config.entry])
    ]
  };

  return config;
};
