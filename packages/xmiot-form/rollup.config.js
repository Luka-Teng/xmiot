const path = require('path')
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
    external: (id) => {
      if (
        /^react/.test(id)
        || /^antd/.test(id)
        || /^react-color/.test(id)
        || /^xgplayer/.test(id)
        || /^ext-name/.test(id)
        || /^lodash/.test(id)
      ) {
        return true
      }
    }
  }
}

const extraOptions = (format) => ({
  buildPaths: [path.resolve(__dirname, 'entry', fileName[format])]
})

export default [
  getRollupConfig(getOptions('cjs'), extraOptions('cjs')),
  getRollupConfig(getOptions('es'), extraOptions('es'))
]
