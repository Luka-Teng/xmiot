const path = require('path')
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
    external: ['react', 'classnames']
  }
}

const extraOptions = (format) => ({
  buildPaths: [path.resolve(__dirname, 'entry', fileName[format])]
})

export default [
  getRollupConfig(getOptions('cjs'), extraOptions('cjs')),
  getRollupConfig(getOptions('es'), extraOptions('es'))
]

