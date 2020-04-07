const path = require('path')
const getRollupConfig = require('../../utils/getRollupConfig')

const fileName = {
  cjs: 'index.common.js',
  es: 'index.esm.js',
  umd: 'index.umd.js'
}

function getOptions (module) {
  return {
    input: './src/index.ts',
    output: {
      file: `./entry/${fileName[module]}`,
      format: module,
      name: 'xy'
    }
  }
}

const extraOptions = (format) => ({
  buildPaths: [path.resolve(__dirname, 'entry', fileName[format])]
})

export default [
  getRollupConfig(getOptions('cjs'), extraOptions('cjs')),
  getRollupConfig(getOptions('es'), extraOptions('es')),
  getRollupConfig(getOptions('umd'), extraOptions('umd'))
]
