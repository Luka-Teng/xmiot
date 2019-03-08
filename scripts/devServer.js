/*
 * usage: devServer -package:包名 -entry:入口文件 -type:项目类型(global, react)
 */

// 对引入的es6进行编译
require('@babel/register')({
  presets: ['@babel/env'],
  ignore: [/node_modules/],
  only: [/.+\.config\.js$/],
  extensions: ['.js']
})

const logger = require('../utils/logger')
const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')
const program = require('commander')
const { isArray } = require('../utils/function')
const resolve = require('rollup-plugin-node-resolve')

const cwd = process.cwd()
const USER_HOME = process.env.HOME || process.env.USERPROFILE
const serverTemp = path.resolve(USER_HOME, 'serverTemp')
const templates = {
  global: 'global.template.html',
  react: 'react.template.html'
}

/*
 * 命令行 packageName
 * -e 该包的入口文件，默认为src/index.js
 * -t 该包是什么属于什么项目，目前支持react, global
 */
program
  .version('1.0.0', '-v, --version')
  .usage('packageName [options]')
  .option('-t, --type [type]', '包类型(react, global)', 'global')
  .parse(process.argv)

// 程序强制结束或自动结束删除缓存文件
process.on('SIGINT', function () {
  logger.warn('程序强制退出')
})

process.on('exit', function () {
  if (fs.existsSync(serverTemp)) {
    fs.removeSync(serverTemp)
  }
  logger.log('程序结束')
})

/*
 * 提取参数，并对参数做验证
 */
const getOptions = () => {
  let packageName = program.args[0]
  if (!packageName) {
    logger.fatal('packageName cannot be null')
  }
  const packageDir = path.resolve(cwd, 'packages', packageName)

  if (!fs.existsSync(packageDir)) {
    logger.fatal('不存在该包名')
  }

  const packageInfo = require(path.resolve(packageDir, 'package.json'))

  // type值可以被package.json的devTestType重写
  const type = packageInfo.devTestType || program.type || 'global'

  return {
    packageName,
    packageDir,
    type
  }
}

// 执行rollup
const run = () => {
  // 获取参数和插件配置
  const { type, packageDir } = getOptions()

  const configs = require(path.resolve(packageDir, 'rollup.config.js')).default
  const config = isArray(configs) ? configs[0] : configs

  if (!fs.existsSync(serverTemp)) {
    fs.mkdirSync(serverTemp)
  }

  fs.copyFileSync(
    path.resolve(__dirname, `devTemplates/${templates[type]}`),
    path.resolve(serverTemp, 'index.html')
  )

  // 增加插件配置
  config.plugins.push(
    serve({
      open: true,
      contentBase: serverTemp,
      historyApiFallback: true,
      host: 'localhost',
      port: 10001
    }),
    livereload({
      watch: serverTemp
    })
  )

  config.plugins.unshift(
    resolve({
      jsnext: true,
      main: true,
      browser: true
    })
  )

  // watchOptions 配置
  const inputOptions = {
    ...config,
    external: [],
    input: path.resolve(packageDir, config.input)
  }
  const outputOptions = {
    file: `${serverTemp}/index.js`,
    format: 'iife',
    name: 'output',
    sourcemap: true
  }
  const watchOptions = {
    ...inputOptions,
    output: [outputOptions],
    watch: {
      include: [path.resolve(packageDir, 'src', '**')]
    }
  }

  // 构建+监听
  const watcher = rollup.watch(watchOptions)
  watcher.on('event', event => {
    // event.code 会是下面其中一个：
    //   START        — 监听器正在启动（重启）
    //   BUNDLE_START — 构建单个文件束
    //   BUNDLE_END   — 完成文件束构建
    //   END          — 完成所有文件束构建
    //   ERROR        — 构建时遇到错误
    //   FATAL        — 遇到无可修复的错误
    switch (event.code) {
      case 'BUNDLE_START':
        logger.success('正在构建文件')
        break
      case 'BUNDLE_END':
        logger.success('构建完成')
        break
      case 'FATAL':
        console.log(JSON.stringify(event))
        logger.fatal('构建失败')
        break
      default:
        break
    }
  })
}

run()
