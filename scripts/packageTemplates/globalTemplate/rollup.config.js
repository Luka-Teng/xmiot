const getRollupConfig = require('../../utils/getRollupConfig')

const fileName = {
  cjs: 'index.common.js',
  es: 'index.esm.js'
}

function getOptions (module) {
  return {
    input: './src/index.{{#if isTs}}ts{{else}}js{{/if}}',
    output: {
      file: `./entry/${fileName[module]}`,
      format: module
    }
  }
}

const extraOptions = {
  type: 'global',
  isTypeScript: {{#if isTs}}true{{else}}false{{/if}},
  noCss: true,
  packageDir: __dirname
}

export default [
  getRollupConfig(getOptions('cjs'), extraOptions),
  getRollupConfig(getOptions('es'), extraOptions)
]
