const getRollupConfig = require('../../utils/getRollupConfig')

const fileName = {
  cjs: 'index.common.js',
  es: 'index.esm.js'
}

function getOptions (module) {
  return {
    input: './src/index.tsx',
    output: {
      file: `./entry/${fileName[module]}`,
      format: module
    },
    external: ['react', 'antd']
  }
}

const extraOptions = {
  type: 'react',
  isTypeScript: true,
  noCss: false,
  packageDir: __dirname
}

export default [
  getRollupConfig(getOptions('cjs'), extraOptions),
  getRollupConfig(getOptions('es'), extraOptions)
]
