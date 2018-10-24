/*
 *
 */
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default (options = {}) => {
  const defaultOptions = {
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      babel({
        babelrc: false,
        presets: [['@babel/preset-env', { modules: false }]],
        exclude: 'node_modules/**'
      }),
      terser()
    ]
  }
  return Object.assign({}, options, defaultOptions)
}
