var config = require('./config')('development')
var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: config.entry,
  output: {
    filename: '[name].js' // for multi chunks
  },
  resolve: config.resolve,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.NoErrorsPlugin()
  ].concat(config.plugins),

  devServer: {
    inline: true,
    noInfo: true,

    host: '0.0.0.0',
    port: config.port
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: [
        'react-hot',
        'babel'
      ]
    }, {
      test: /\.less$/,
      loaders: [
        'style',
        'css?sourceMap',
        'postcss',
        'less?sourceMap'
      ]
    }]
  },

  postcss: config.postcss,

  devtool: 'eval'
};
