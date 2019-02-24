const getRollupConfig = require('../../utils/getRollupConfig')

const fileName = module => {
  const strategy = {
    cjs: 'index.common.js',
    es: 'index.esm.js'
  }
  return strategy[module]
}

function getOptions (module) {
  return {
    input: './src/index.ts',
    output: {
      file: `./entry/${fileName(module)}`,
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
