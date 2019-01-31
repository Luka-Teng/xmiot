const babelConfig = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react'
  ],
  exclude: 'node_modules/**',
  plugins: [
    'babel-plugin-inline-import-data-uri',
    '@babel/plugin-transform-member-expression-literals',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-transform-property-literals',
    [
      '@babel/plugin-transform-runtime',
      {
        'helpers': false
      }
    ],
    '@babel/plugin-transform-spread',
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-object-rest-spread',
    [
      '@babel/plugin-proposal-decorators',
      {
        'decoratorsBeforeExport': true
      }
    ]
  ]
}

module.exports = {
  babelConfig
}