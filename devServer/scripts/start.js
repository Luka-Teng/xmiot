const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const path = require('path')

const options = require('./options')
const createCompiler = require('../utils/createCompiler')
const config = require('../webpack.config')(options)

let compiler = createCompiler({
  webpack,
  config,
  isTs: options.isTs,
  getDevServer: () => {
    return devServer
  }
})

const serverConfig = {
  compress: true,
  contentBase: path.resolve('public'),
  hot: true,
  publicPath: '/',
  quiet: true,
  historyApiFallback: true,
  /* 暂时对warnings，errors统一占屏输出，后续剥离warnings值浏览器console */
  overlay: {
    errors: true,
    warnings: true
  }
}

const devServer = new WebpackDevServer(compiler, serverConfig)


devServer.listen(3001, '0.0.0.0', err => {
  if (err) {
    return console.log(err);
  }
})