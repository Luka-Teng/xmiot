/*
 * rollUp基础配置
 * 默认NODE_ENV配置为development
 * 默认API_ENV配置为development
 * params: type: global, react
 */
const babel = require('rollup-plugin-babel')
const path = require('path')
// const commonjs = require('rollup-plugin-commonjs')
const postcss = require('rollup-plugin-postcss')
const url = require('postcss-url')
const fileAsBlob = require('rollup-plugin-file-as-blob')
const replace = require('rollup-plugin-replace')
const { eslint } = require('rollup-plugin-eslint')
const { getClientEnvironment } = require('./env')
const { multiDeepAssign } = require('./function')
const typescript = require('rollup-plugin-typescript2')
const json = require('rollup-plugin-json')

// const namedExports = require('./namedExports')

/*
 * eslint的配置在每个包中，由包主人自行管理
 * eslint的插件包，preset包由lerna统一管理
 */
function esLintConfig (packageDir) {
  return eslint({
    // 只允许eslint当前包
    include: path.resolve(packageDir, 'src/**/*.js'),
    cwd: packageDir
  })
}

module.exports = (
  options = {},
  { type = 'global', packageDir = '', isTypeScript = false, noCss = false } = {}
) => {
  const plugins = [
    // 环境变量的定义
    replace({
      ...getClientEnvironment().stringified
      // 不包括除了react之外的包
      // exclude: /node_modules\/(?!react\/).*/
    })
  ]

  if (!isTypeScript) {
    // 不是 TypeScript 就是 JavaScript
    plugins.push(esLintConfig(packageDir))
  } else {
    // Typescript 配置
    plugins.push(
      typescript({
        clean: true,
        abortOnError: false
      })
    )
  }

  const defaultOptions = {
    plugins: [
      ...plugins,

      // babel先对react进行转义,只有在react环境中执行
      babel({
        babelrc: false,
        presets: ['@babel/preset-react'],
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: [
          [path.resolve(__dirname, 'babel-plugin-require-to-import')],
          ['@babel/plugin-proposal-class-properties'],
          ['@babel/plugin-proposal-object-rest-spread'],
          [
            'import',
            {
              libraryName: 'antd',
              ibraryDirectory: 'es'
            }
          ]
        ]
      }),

      // Convert CommonJS modules to ES6
      // 增加对react的Component的导出
      // commonjs(
      //   type === 'react' ? { namedExports: namedExports(packageDir) } : {}
      // ),

      // read json as es6 module
      json(),

      /*
       * JS方式引入less
       * 后期最好将css独立分割出来维护
       */
      noCss
        ? null
        : postcss({
            plugins: [url({ url: 'inline' })]
          }),

      // 引入的图片统一用base64输出，后期要做大小限制
      fileAsBlob({
        include: '**/**.png'
      })
    ].filter(e => e !== '')
  }

  // 深拷贝options，提供各个包自主配置plugin的能力
  return multiDeepAssign({}, options, defaultOptions)
}
