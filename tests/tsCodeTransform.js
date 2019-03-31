const { tsConfig } = require('./config')

module.exports = require('ts-jest').createTransformer({
  ...tsConfig
})
