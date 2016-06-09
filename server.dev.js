var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack.dev.config.js');
var devport = config.devport;
config.entry.unshift('webpack-dev-server/client?http://dev.broltes.com:' + devport);

var compiler = webpack(config);
new WebpackDevServer(compiler, {
    contentBase: 'demos',
    hot: true,
    noInfo: true
}).listen(config.devport);
