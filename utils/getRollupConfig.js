/*
 * rollUp基础配置
 * 默认NODE_ENV配置为development
 * 默认API_ENV配置为development
 * params: type: global, react
 */
process.env.NODE_ENV = 'production'

const babel = require('rollup-plugin-babel')
const path = require('path')
const postcss = require('rollup-plugin-postcss')
const url = require('postcss-url')
const fileAsBlob = require('rollup-plugin-file-as-blob')
const replace = require('rollup-plugin-replace')
const { getClientEnvironment } = require('./env')
const { multiDeepAssign } = require('./function')
const json = require('rollup-plugin-json')

module.exports = (
  options = {},
  { type = 'global', packageDir = '', isTypeScript = false, noCss = false } = {}
) => {

  const defaultOptions = {
    plugins: [
      {
        resolveId: (i, e) => {
          console.log(i)
          console.log(e)
        }
      },
      replace({
        ...getClientEnvironment().stringified
        // 不包括除了react之外的包
        // exclude: /node_modules\/(?!react\/).*/
      }),

      // babel先对react进行转义,只有在react环境中执行
      babel({
        babelrc: false,
        presets: [['react-app', { flow: false, typescript: true }]],
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        runtimeHelpers: true,
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
