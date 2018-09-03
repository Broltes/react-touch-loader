const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');
const { dist } = require('../package.json').config;

const distPath = path.resolve(dist);

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(distPath, { allowExternal: true }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/](react|react-dom)[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  output: {
    filename: '[name].bundle.js',
    path: distPath,
  },
});
