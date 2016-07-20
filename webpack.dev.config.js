var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var devport = 6002;

module.exports = {
    context: path.resolve('demos'),
    entry: [
        'babel-polyfill',
        './app.jsx'
    ],
    plugins: [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({ template: 'index.html' })
    ],
    devServer: {
        inline: true,
        noInfo: true,

        host: '0.0.0.0',
        port: devport
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.resolve('./src')
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: [
                    'react-hot',
                    'babel?presets[]=react,presets[]=es2015'
                ]
            }, {
                test: /\.less$/,
                loaders: [
                    'style',
                    'css?sourceMap',
                    'postcss',
                    'less?sourceMap'
                ]
            }
        ]
    },

    postcss: function() {
        return [
            require('autoprefixer')({ browsers: ["Android >= 4", "iOS >= 7"] })
        ];
    },

    devtool: 'eval'
};
