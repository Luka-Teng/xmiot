const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const ShowErrorsWebpackPlugin = require('./plugins/showErrorsWebpackPlugin')

/* devServer不负责打包，环境变量是development */
process.env.NODE_ENV = 'development'

module.exports = (isTs) => {
  return {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    /* 默认为工作目录 */
    context: process.cwd(),
    entry: [
      path.resolve('index')
    ],
    output: {
      path: path.resolve('build'),
      filename: 'bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: true
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    module: {
      rules: [{
        oneOf: [{
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: __dirname,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            configFile: false,
            presets: [['react-app', { "flow": false, "typescript": true }]],
            overrides: [{
              plugins: [["@babel/plugin-proposal-decorators", { "legacy": true }]]
            }]
          },
        }, {
          test: /\.(js|mjs)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [
              [
                require.resolve('babel-preset-react-app/dependencies'),
                { helpers: true },
              ],
            ],
            cacheDirectory: true
          },
        }]
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve('public/index.template.html'),
        inject: true
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ShowErrorsWebpackPlugin(),
      /**
       * tsconfig默认path.resolve(compiler.options.context, './tsconfig.json')
       * tslint默认根目录为cwd
       */
      isTs && new ForkTsCheckerWebpackPlugin({
        async: true,
        /* 需要抛出错误的文件 */
        reportFiles: [
          '**/*.{ts,tsx}',
          '!**/*.json',
          '!**/__tests__/**',
          '!**/?(*.)(spec|test).*'
        ],
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        silent: true
      })
    ].filter(Boolean)
  }
}