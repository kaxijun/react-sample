const webpack = require('webpack');
const path = require('path');
const pkg = require('./package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const autoprefixer = require('autoprefixer');

const IS_PROD = process.env.NODE_ENV === 'production';
const ROOT_PATH = path.resolve(__dirname, '.');
const resolve = dir => path.join(ROOT_PATH, dir);

console.log(IS_PROD, resolve('src'));

const config = {
  mode: IS_PROD ? 'production' : 'development', // 模式配置
  devtool: 'inline-source-map',
  entry: {
    main: IS_PROD
      ? ['babel-polyfill', './src/main.js']
      : ['babel-polyfill', 'react-hot-loader/patch', resolve('src/main.js')]
  },

  output: {
    path: resolve('./dist'),
    // publicPath: `${pkg.path === '/' ? '' : pkg.path}/assets/`,
    filename: IS_PROD ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    chunkFilename: IS_PROD ? 'js/[name].[chunkhash].js' : 'js/[name].chunk.js' // works with lazy loading
  },

  resolve: {
    // 别名
    alias: {
      pages: path.join(__dirname, 'src/pages'),
      component: path.join(__dirname, 'src/component'),
      actions: path.join(__dirname, 'src/redux/actions'),
      reducers: path.join(__dirname, 'src/redux/reducers'),
      '@': resolve('src')
    },
    // 省略后缀
    extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.less']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          resolve('src'),
          // webpack-dev-server#1090 for Safari
          resolve('/node_modules/webpack-dev-server/')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // plugins: ["lodash"],
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: pkg.browserslist
                }
              }
            ],
            'stage-2',
            'react'
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: pkg.browserslist
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({
                  browsers: pkg.browserslist
                })
              ]
            }
          },
          { loader: 'less-loader' }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        }
      }
    ]
  }, // 处理对应模块
  plugins: [
    new CleanWebpackPlugin('dist'),
    new HtmlWebpackPlugin({
      template: './public/index.html', // 在src目录下创建一个index.html来充当模板
      hash: true, // 打包后的bundle.js后面会加上hash串
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    new MiniCssExtractPlugin({
      filename: IS_PROD ? 'css/[name].[contenthash].css' : 'css/[name].css'
    })
  ], // 对应插件

  optimization: {
    minimize: IS_PROD, // 是否进行代码压缩
    splitChunks: {
      chunks: 'async',
      minSize: 30000, // 模块大于30k会被抽离到公共模块
      minChunks: 1, // 模块出现1次就会被抽离到公共模块
      maxAsyncRequests: 5, // 异步模块，一次最多只能被加载5个
      maxInitialRequests: 3, // 入口模块最多只能加载3个
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
};

if (!IS_PROD) {
  config.devtool = 'cheap-module-source-map';
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
  config.devServer = {
    host: '0.0.0.0',
    port: '3880',
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    overlay: true, // 浏览器页面上的显示错误
    historyApiFallback: true
  };
}

if (IS_PROD) {
  config.devtool = 'source-map';
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new AssetsWebpackPlugin({
    //   filename: 'manifest.json',
    //   path: resolve('public/assets'),
    //   prettyPrint: true
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: false,
      reportFilename: resolve('webpack-report/index.html'),
      statsFilename: resolve('webpack-report/stats.json')
    })
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  );

  // https://webpack.js.org/configuration/performance
  config.performance = {
    hints: 'warning'
  };
}

module.exports = config;
