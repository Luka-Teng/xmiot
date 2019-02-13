const getRollupConfig = require('../../utils/getRollupConfig')

function getOptions (module) {
  return {
    input: './src/index.ts',
    output: {
      file: './entry/index.common.js',
      format: module
    }
  }
}

const extraOptions = {
  type: 'global',
  isTypeScript: true,
  noCss: true,
  packageDir: __dirname
}

export default [
  getRollupConfig(getOptions('cjs'), extraOptions),
  getRollupConfig(getOptions('es'), extraOptions)
]
