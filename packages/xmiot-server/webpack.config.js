/**
 * TODOLIST
 * 1. 目前babel，ts，tslint，eslint检测只会在包入口所在目录，需改善
 */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const ShowErrorsWebpackPlugin = require('./plugins/showErrorsWebpackPlugin')
const overrideTsConfig = require('./utils/overrideTsConfig')
const lookUpFile = require('./utils/lookUpFile')
const getStyleLoaders = require('./utils/getStyleLoaders')

/* devServer不负责打包，环境变量是development */
process.env.NODE_ENV = 'development'

module.exports = ({ isTs, entry, workDir: _workDir }) => {
  const absoluteEntry = path.resolve(process.cwd(), entry)
  const absoluteEntryDir = path.resolve(process.cwd(), entry, '..')
  const workDir = _workDir || absoluteEntryDir

  if (isTs) {
    /* 重置ts检测目录 */
    overrideTsConfig({
      include: [workDir]
    })
  }

  return {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    /* 默认为工作目录 */
    context: process.cwd(),
    entry: [path.resolve(__dirname, 'plugins/browserErrors'), absoluteEntry],
    output: {
      path: path.resolve('build'),
      filename: 'bundle.js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: false
      },
      runtimeChunk: true
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          enforce: 'pre',
          loader: require.resolve('eslint-loader'),
          include: absoluteEntry
        },
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: workDir,
              exclude: /node_modules/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                presets: [['react-app', { flow: false, typescript: true }]],
                overrides: [
                  {
                    plugins: [
                      ['@babel/plugin-proposal-decorators', { legacy: true }],
                      ['@babel/plugin-proposal-class-properties'],
                      [
                        'import',
                        {
                          libraryName: 'antd',
                          ibraryDirectory: 'es',
                          style: true
                        }
                      ]
                    ]
                  }
                ]
              }
            },
            {
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
                    { helpers: true }
                  ]
                ],
                cacheDirectory: true
              }
            },
            {
              test: /\.css$/,
              use: getStyleLoaders()
            },
            {
              test: /\.less$/,
              use: getStyleLoaders('less-loader')
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.template.html'),
        inject: true
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ShowErrorsWebpackPlugin(),
      /**
       * tsconfig默认path.resolve(compiler.options.context, './tsconfig.json')
       * tslint默认根目录为cwd
       */
      isTs &&
        new ForkTsCheckerWebpackPlugin({
          tsconfig: path.resolve(__dirname, 'tsconfig.override.json'),
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
          silent: true,
          tslint: lookUpFile({
            rootDir: process.cwd(),
            startDir: workDir,
            file: 'tslint.json'
          })
        })
    ].filter(Boolean)
  }
}
