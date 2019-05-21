/* 获取入口参数先行 */
const options = require('./options')

const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const path = require('path')
const open = require('open')

const createCompiler = require('../utils/createCompiler')
const config = require('../webpack.config')(options)
const clearConsole = require('../utils/clearConsole')
const log = require('../utils/log')
const choosePort = require('../utils/choosePort')

/* 默认端口 */
const PORT = 3000
const HOST = '0.0.0.0'

let devServer

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
  contentBase: path.resolve(__dirname, '../public'),
  hot: true,
  publicPath: '/',
  quiet: true,
  historyApiFallback: true,
  /* 暂时对warnings，errors统一占屏输出，后续剥离warnings值浏览器console */
  overlay: {
    errors: true,
    warnings: false
  },
  /* 方便对源码进行调试 */
  watchOptions: {
    ignored: []
  }
}

/* 必须传入host，nodejs会默认像去查询ipv6的端口是否存在 */
choosePort(PORT, HOST, port => {
  /* devServer实例一创建就开始build */
  devServer = new WebpackDevServer(compiler, serverConfig)
  devServer.listen(port, HOST, err => {
    if (err) {
      return console.log(err)
    }

    clearConsole()
    open(`http://${HOST}:${port}`).catch(e => {
      log.warn('无法打开浏览器')
    })

    const signals = ['SIGINT', 'SIGTERM']
    signals.forEach(sig => {
      process.on(sig, () => {
        devServer.close()
        clearConsole()
        process.exit()
      })
    })
  })
})
