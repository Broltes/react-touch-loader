var gulp = require('gulp');
var connect = require('gulp-connect');
var webpack = require('webpack');
var del = require('del');
var path = require("path");


// demos tasks
//
var config = require('./webpack.dev.config.js');
var devport = config.devport;
var demoDist = '../github.io/tloader';

gulp.task('demos-clean', function () {
    return del([
        demoDist + '/**'
    ],{
        force: true
    });
});
gulp.task("demos-build", function(callback) {
    config.entry = config.entry.slice(-2);
    config.output.path = path.join(__dirname, demoDist);
    config.plugins = [
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.ProgressPlugin(function handler(percentage, msg) {
            console.log(Math.round(percentage*100) + '%', msg);
        })
    ].concat(config.plugins.slice(-1));

    delete config.devtool;
    module.exports = config;

    webpack(config, function(err, stats) {
        if (err) throw new err;

        callback();
        gulp.src('demos/*.jpg')
            .pipe(gulp.dest(demoDist));
    });
});
gulp.task('demos-server', function () {
    connect.server({
        root: demoDist,
        port: devport
    });
});
gulp.task('demos', ['demos-clean', 'demos-build', 'demos-server']);
