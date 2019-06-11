const getRollupConfig = require('../../utils/getRollupConfig')

export default [
  getRollupConfig(
    {
      input: './src/index.js',
      output: {
        file: './entry/index.common.js',
        format: 'cjs'
      },
      external: id => {
        if (
          /^react/.test(id) ||
          /^antd/.test(id) ||
          /^react-color/.test(id) ||
          /^xgplayer/.test(id) ||
          /^ext-name/.test(id) ||
          /^lodash/.test(id)
        ) {
          return true
        }
      }
    },
    { type: 'react', packageDir: __dirname }
  ),
  getRollupConfig(
    {
      input: './src/index.js',
      output: {
        file: './entry/index.esm.js',
        format: 'es'
      },
      external: id => {
        if (
          /^react/.test(id) ||
          /^antd/.test(id) ||
          /^react-color/.test(id) ||
          /^xgplayer/.test(id) ||
          /^ext-name/.test(id) ||
          /^lodash/.test(id)
        ) {
          return true
        }
      }
    },
    { type: 'react', packageDir: __dirname }
  )
]
