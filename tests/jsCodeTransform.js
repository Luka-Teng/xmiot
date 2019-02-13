const { babelConfig } = require('./config')

module.exports = require('babel-jest').createTransformer({
  ...babelConfig
})
