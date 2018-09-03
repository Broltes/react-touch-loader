const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const templatePath = 'example/index.ejs';

module.exports = {
  entry: {
    app: './example',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: templatePath,
      title: 'react-touch-loader',
      filename: 'index.html',
      inject: true,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      src: path.resolve('src'),
      'react-touch-loader': path.resolve('src/react-touch-loader'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
};
