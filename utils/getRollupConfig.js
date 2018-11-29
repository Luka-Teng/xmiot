/*
 * rollUp基础配置
 * 默认NODE_ENV配置为development
 * 默认API_ENV配置为development
 * params: type: global, react
 */
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const postcss = require('rollup-plugin-postcss')
const fileAsBlob = require('rollup-plugin-file-as-blob')
const replace = require('rollup-plugin-replace')
const { eslint } = require('rollup-plugin-eslint')
const { getClientEnvironment } = require('./env')
const { multiDeepAssign } = require('./function')

module.exports = (options = {}, { type = 'global', packageDir = '' } = {}) => {
  const defaultOptions = {
    plugins: [
      /*
       * eslint的配置在每个包中，由包主人自行管理
       * eslint的插件包，preset包由lerna统一管理
       */
      eslint({
        include: ['**/*.js'],
        cwd: packageDir
      }),

      // 环境变量的定义
      replace({
        ...getClientEnvironment().stringified
        // 不包括除了react之外的包
        // exclude: /node_modules\/(?!react\/).*/
      }),

      // rollup引入node_modules模块
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),

      // babel先对react进行转义,只有在react环境中执行
      type === 'react'
        ? babel({
          babelrc: false,
          presets: ['@babel/preset-react'],
          exclude: 'node_modules/**',
          plugins: ["@babel/plugin-proposal-class-properties"]
        })
        : '',

      // Convert CommonJS modules to ES6
      commonjs(),

      /*
       * JS方式引入less
       * 后期最好将css独立分割出来维护
       */
      postcss(),

      // 引入的图片统一用base64输出，后期要做大小限制
      fileAsBlob({
        include: '**/**.png'
      }),

      // babel进行es6转义
      babel({
        babelrc: false,
        presets: [['@babel/preset-env', { modules: false }]],
        exclude: 'node_modules/**'
      })
    ].filter(e => e !== '')
  }

  // 深拷贝options，提供各个包自主配置plugin的能力
  return multiDeepAssign({}, options, defaultOptions)
}
