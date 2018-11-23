const getRollupConfig = require('../../utils/getRollupConfig')

export default [
  getRollupConfig({
    input: './src/index.js',
    output: {
      file: './entry/index.common.js',
      format: 'cjs'
    }
  }, {type: 'react', packageDir: __dirname}),
  getRollupConfig({
    input: './src/index.js',
    output: {
      file: './entry/index.esm.js',
      format: 'es'
    }
  }, {type: 'react', packageDir: __dirname})
]
