const { tsConfig } = require('./config')

module.exports = require('ts-jest/preprocessor').createTransformer({
  ...tsConfig
})
