var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var dist = require('../package.json').DIST || 'dist'
var devPort = 8080

var config = {
  entry: {
    app: [
      './example/app.jsx'
    ],
    vendor: [
      'react',
      'react-dom'
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    // Limit the module searching
    modules: [path.resolve('node_modules')],
    alias: {
      'react-touch-loader': path.resolve('./src/react-touch-loader')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'react-touch-loader',
      filename: 'index.html',
      template: 'build/index.ejs',
      inject: true
    })
  ],
  postcss: function() {
    return [
      require('autoprefixer')({
        browsers: ["Android >= 4", "iOS >= 7"]
      })
    ];
  },

  outputPath: path.resolve(dist)
}

module.exports = function(ENV) {
  if (ENV === 'development') {
    Object.assign(config, {
      entry: config.entry.app,
      port: devPort
    })
  }

  return config
}
