const babelConfig = {
  overrides: [
    {
      exclude: /node_modules/,
      presets: [['react-app', { flow: false, typescript: true }]],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }
  ]
}

module.exports = {
  process (src, filename, config) {
    const code = require('babel-jest')
      .createTransformer({
        ...babelConfig
      })
      .process(src, filename, config)

    return code
  }
}
