/*
 * usage: devServer -package:包名 -entry:入口文件 -type:项目类型(global, react)
 */
const logger = require('../utils/logger')
const path = require('path')
const fs = require('fs-extra')
const rollup = require('rollup')
const getRollupConfig = require('../utils/getRollupConfig')
const serve = require('rollup-plugin-serve')
const livereload = require('rollup-plugin-livereload')
const program = require('commander')

const cwd = process.cwd()
const USER_HOME = process.env.HOME || process.env.USERPROFILE
const serverTemp = path.resolve(USER_HOME, 'serverTemp')

/*
 * 命令行
 * -p 需要运行的包名称，必填
 * -e 该包的入口文件，默认为src/index.js
 * -t 该包是什么属于什么项目，目前支持react, global
 */
program
  .version('1.0.0', '-v, --version')
  .usage('[options]')
  .option('-p, --package-name [name]', '添加包名', '')
  .option('-e, --entry [address]', '添加入口', 'src/index.js')
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
  let {packageName, entry, type} = program
  if (!packageName) {
    logger.fatal('packageName cannot be null')
  }
  const packageDir = path.resolve(cwd, 'packages', packageName)
  entry = path.resolve(cwd, 'packages', packageName, entry)

  if (!fs.existsSync(packageDir)) {
    logger.fatal('不存在该包名')
  }
  if (!fs.existsSync(entry)) {
    logger.fatal('不存在该入口文件')
  }

  const packageInfo = require(path.resolve(packageDir, 'package.json'))
  // type值可以被package.json的devTestType重写
  type = packageInfo.devTestType || type

  return {
    packageName,
    packageDir,
    entry,
    type
  }
}

// 执行rollup
const run = () => {
  // 获取参数和插件配置
  const {type, packageDir, entry} = getOptions()

  // 使用的模板，默认为global
  let template = 'global.template.html'

  const config = getRollupConfig({}, {
    type,
    packageDir
  })

  if (!fs.existsSync(serverTemp)) {
    fs.mkdirSync(serverTemp)
    // 根据type属性，切换模板
    switch (type) {
      case 'react':
        template = 'react.template.html'
        break
    }
    fs.copyFileSync(path.resolve(__dirname, `devTemplates/${template}`), path.resolve(serverTemp, 'index.html'))
  }

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

  // watchOptions 配置
  const inputOptions = {
    input: entry,
    ...config
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
      include: [
        path.resolve(packageDir, 'src', '**')
      ]
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
    }
  })
}

run()
