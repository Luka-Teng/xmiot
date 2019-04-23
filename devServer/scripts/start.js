/* 获取入口参数先行 */
const options = require('./options')

const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const path = require('path')

const createCompiler = require('../utils/createCompiler')
const config = require('../webpack.config')(options)
const clearConsole = require('../utils/clearConsole')

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
  },
  open: 'Google Chrome'
}

const devServer = new WebpackDevServer(compiler, serverConfig)

devServer.listen(3001, '0.0.0.0', err => {
  if (err) {
    return console.log(err)
  }

  clearConsole()
  
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach((sig) => {
    process.on(sig, () => {
      devServer.close()
      clearConsole()
      process.exit()
    })
  })
})