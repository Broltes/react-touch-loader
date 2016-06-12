var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require("path");

var node_modules_dir = path.resolve(__dirname, 'node_modules');
module.exports = {
    devport: 6002,
    entry: [
        'webpack/hot/only-dev-server',
        'babel-polyfill',
        './demos/app.jsx',
    ],
    output: {
        path: path.join(__dirname, "demos"),
        filename: 'app.js'
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'demos/index.html')
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.resolve('./src')
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [node_modules_dir],
                loaders: [
                    'react-hot',
                    'babel?presets[]=react,presets[]=es2015',
                ]
            },{
                test: /\.less$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ]
            }
        ]
    },

    postcss: function () {
        return [
            require('autoprefixer')({ browsers: ["Android >= 4", "iOS >= 7"]}),
        ];
    },

    devtool: 'source-map',
};
