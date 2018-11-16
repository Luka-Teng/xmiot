/*
 * rollUp基础配置
 * 默认NODE_ENV配置为development
 * 默认API_ENV配置为development
 * params: type: global, react
 */
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import fileAsBlob from 'rollup-plugin-file-as-blob'
import replace from 'rollup-plugin-replace'
import { getClientEnvironment } from './env'

export default (options = {}, {type = 'global', packageDir = ''}) => {
  const defaultOptions = {
    plugins: [
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
          presets: [
            '@babel/preset-react'
          ],
          exclude: 'node_modules/**'
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
        presets: [
          ['@babel/preset-env', { modules: false }]
        ],
        exclude: 'node_modules/**'
      })
    ].filter((e) => e !== '')
  }
  return Object.assign({}, options, defaultOptions)
}
