import getRollupConfig from '../../utils/getRollupConfig'

export default [
  getRollupConfig({
    input: './src/index.js',
    output: {
      file: './lib/index.common.js',
      format: 'cjs'
    }
  }),
  getRollupConfig({
    input: './src/index.js',
    output: {
      file: './lib/index.esm.js',
      format: 'es'
    }
  })
]
