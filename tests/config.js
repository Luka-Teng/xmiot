const fs = require('fs')
const path = require('path')

// js编译
const babelConfig = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  exclude: 'node_modules/**',
  plugins: [
    'babel-plugin-inline-import-data-uri',
    '@babel/plugin-transform-member-expression-literals',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-transform-property-literals',
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false
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
        decoratorsBeforeExport: true
      }
    ]
  ]
}

// ts编译
let tsConfig = {
  tsConfig: {
    target: 'es5',
    jsx: 'preserve',
    allowSyntheticDefaultImports: true,
    allowJs: true,
    experimentalDecorators: true,
    module: "esnext",
    moduleResolution: "node",
    lib: [
      "dom",
      "es2017"
    ],
    skipLibCheck: true,
    esModuleInterop: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true
  }
}
// const tsConfigPath = path.resolve(process.cwd(), 'tsconfig.json')
// if (fs.existsSync(tsConfigPath)) {
//   tsConfig = require(tsConfigPath)
// }
// tsConfig.compilerOptions = Object.assign(tsConfig.compilerOptions, {
//   target: 'es5000',
//   jsx: 'preserve',
//   allowSyntheticDefaultImports: true,
//   allowJs: true,
//   experimentalDecorators: true,
//   module: "esnext",
//   moduleResolution: "nodeff",
//   lib: [
//     "dom",
//     "es2017"
//   ],
//   rootDirs:['./'],
//   skipLibCheck: true,
//   esModuleInterop: true,
//   strict: true,
//   forceConsistentCasingInFileNames: true,
//   resolveJsonModule: true,
//   isolatedModules: false,
//   noEmit: true
// })


module.exports = {
  babelConfig,
  tsConfig
}
