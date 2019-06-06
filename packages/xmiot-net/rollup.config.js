const getRollupConfig = require('../../utils/getRollupConfig')

const fileName = {
  cjs: 'index.common.js',
  es: 'index.esm.js'
}

function getOptions (module) {
  return {
    input: './src/index.js',
    output: {
      file: `./entry/${fileName[module]}`,
      format: module
    },
    external: (id) => {
      if (
        /^axios/.test(id)
      ) {
        return true
      }
    }
  }
}

const extraOptions = {
  type: 'global',
  isTypeScript: false,
  noCss: true,
  packageDir: __dirname
}

export default [
  getRollupConfig(getOptions('cjs'), extraOptions),
  getRollupConfig(getOptions('es'), extraOptions)
]
