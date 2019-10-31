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
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const url = require('postcss-url')
const fileAsBlob = require('rollup-plugin-file-as-blob')
const replace = require('rollup-plugin-replace')
const { terser } = require('rollup-plugin-terser')
const { getClientEnvironment } = require('./env')
const { multiDeepAssign } = require('./function')
const json = require('rollup-plugin-json')
const extensions = require('./rollup-plugin-extensions')

module.exports = (options = {}) => {
  const defaultOptions = {
    plugins: [
      extensions(['.jsx', '.ts', '.tsx']),
      replace({
        ...getClientEnvironment().stringified
        // 不包括除了react之外的包
        // exclude: /node_modules\/(?!react\/).*/
      }),
      babel({
        babelrc: false,
        presets: [
          ['react-app', { flow: false, typescript: true, helpers: false }]
        ],
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        plugins: [
          [path.resolve(__dirname, 'babel-plugin-require-to-import')],
          [
            'import',
            {
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: 'css'
            }
          ]
        ]
      }),
      resolve(),
      commonjs(),
      json(),
      postcss({
        plugins: [url({ url: 'inline' })]
      }),
      // 引入的图片统一用base64输出，后期要做大小限制
      fileAsBlob({
        include: '**/**.png'
      }),
      terser()
    ].filter(e => e !== '')
  }

  // 深拷贝options，提供各个包自主配置plugin的能力
  return multiDeepAssign({}, options, defaultOptions)
}
