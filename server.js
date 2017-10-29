/**
 * Created by zhengpeng on 2016/11/4.
 */
const Webpack = require("webpack");
const WebpackDevServer = require('webpack-dev-server');

var compiler = Webpack({
    entry : [],
    devtool: 'source-map',

    output: {
        path: '/dist',
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});
var server = new WebpackDevServer(compiler, {
    publicPath: '/',
    stats: {
        colors: true //显示不同的颜色区分打包的文件
    }
});

server.listen(4000, function(err){
    if (err) {
        console.log(err);
        return
    }
});