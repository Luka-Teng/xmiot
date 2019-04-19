const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const path = require('path')

const config = require('../webpack.config')(true)
// const options = require('./options')
let compiler = webpack(config)

const serverConfig = {
  compress: true,
  contentBase: path.resolve('public'),
  hot: true,
  publicPath: '/',
  quiet: true,
  historyApiFallback: true,
  overlay:false
}

const devServer = new WebpackDevServer(compiler, serverConfig)


devServer.listen(3001, '0.0.0.0', err => {
  if (err) {
    return console.log(err);
  }
})