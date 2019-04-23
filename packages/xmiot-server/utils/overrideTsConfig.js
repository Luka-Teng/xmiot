const fs = require('fs-extra')
const path = require('path')
const tsconfig = require('../tsconfig.json')

const override = _tsconfig => {
  const config = {
    ...tsconfig,
    ..._tsconfig
  }

  fs.outputJsonSync(
    path.resolve(__dirname, '../tsconfig.override.json'),
    config,
    { spaces: 2 }
  )
}

module.exports = override
