const webpack = require('webpack')
const config = require('../webpack.config')()
let compiler = webpack(config)


compiler.run((err, stats) => {
  console.log(err)
})