'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')    //css打包成css文件已link的方式引入的包
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin') // 压缩css的包
const UglifyJsPlugin = require('uglifyjs-webpack-plugin') //压缩js代码的包


var entries = utils.getMultiEntry('./src/' + config.moduleName + '/**/**/*.js'); // 获得入口js文件
var chunks = Object.keys(entries);
console.log(entries, 'pro-entries')
const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  // 暂时注释
  // devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/encore/[name].js')
  },
  // output: {
  //   path: config.build.assetsRoot,
  //   filename: utils.assetsPath('js/[name].[chunkhash].js'),
  //   chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  // },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css'),
      // filename: utils.assetsPath('css/[name].[contenthash].css'),

      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      // allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
   
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: chunks,
      minChunks: 4 || chunks.length
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 为了避免每次更改项目代码时导致venderchunk的chunkHash改变，我们还会单独生成一个manifestchunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    //我们主要逻辑的js文件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async', //开启路由异步加载
      children: true,
      minChunks: 3
    }),

    // copy custom static assets  拷贝资源文件到打包项目中   
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

//构建生成多页面的HtmlWebpackPlugin配置，主要是循环生成
var pages = utils.getMultiEntry('./src/' + config.moduleName + '/**/**/*.html');
for (var pathname in pages) {
  var conf = {
    filename: pathname.split("/")[1] + '.html',
    template: pages[pathname], // 模板路径
    chunks: ['vendor',"manifest","app" , pathname], // 每个html引用的js模块
    inject: true,              // js插入位置
    hash: true
  };

  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = webpackConfig
