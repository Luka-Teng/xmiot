const babelConfig = {
  presets: [['react-app', { flow: true, typescript: true }]],
  overrides: [
    {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }
  ]
}

module.exports = require('babel-jest').createTransformer({
  ...babelConfig
})
