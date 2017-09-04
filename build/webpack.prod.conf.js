var config = require('./config')('production')
var webpack = require('webpack')
var path = require("path")

module.exports = {
  entry: config.entry,
  output: {
    path: config.outputPath,
    filename: '[name].js?[chunkhash]'
  },
  resolve: config.resolve,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ].concat(config.plugins),

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: [
        'babel'
      ]
    }, {
      test: /\.less$/,
      loaders: [
        'style',
        'css?-minimize',
        'postcss',
        'less'
      ]
    }]
  },

  postcss: config.postcss
};
