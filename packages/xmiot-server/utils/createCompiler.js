/**
 * @param { object } webpack webpack构造函数
 * @param { boolean } isTs 是否是ts
 * @param { object } config webpack配置
 * @param { function } getDevServer 获取devServer的方法
 * 对compiler做预处理
 * 主要是push forkTsCheckerWebpackPlugin的errors和warnings
 * TODO: 对内部的输出统一化，美观化
 */

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const chalk = require('chalk')
const clearConsole = require('./clearConsole')
const typescriptFormat = require('./typescriptFormat')

/* 对errors和warnings的终端统一输出 */
const output = messages => {
  const isSuccessful = !messages.errors.length && !messages.warnings.length
  if (isSuccessful) {
    console.log(chalk.green('Compiled successfully!'))
  }

  /* 输出errors */
  if (messages.errors.length) {
    /* 一般情况下我们只需要输出第一个错误 */
    console.log(chalk.red('Failed to compile.\n'))
    console.log(messages.errors[0])
    return
  }

  /* 输出warnings */
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'))
    console.log(messages.warnings.join('\n\n'))
  }
}

module.exports = ({ webpack, config, isTs, getDevServer }) => {
  /* 实例化错误的输出 */
  let compiler
  try {
    compiler = webpack(config)
  } catch (err) {
    console.log(chalk.red('Failed to compile.'))
    console.log()
    console.log(err.message || err)
    console.log()
    process.exit(1)
  }

  /* invalid会在webpack重新编译的过程中产生，这边直接输出compiler */
  compiler.hooks.invalid.tap('invalid', () => {
    clearConsole()
    console.log('Compiling...')
  })

  /* 用于记录tsChecker完成的promise */
  let tsMessagesPromise
  let tsMessagesResolver

  if (isTs) {
    compiler.hooks.beforeCompile.tap('createCompiler', () => {
      tsMessagesPromise = new Promise(resolve => {
        tsMessagesResolver = msgs => resolve(msgs)
      })
    })

    ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler).receive.tap(
      'afterTypeScriptCheck',
      (diagnostics, lints) => {
        const allMsgs = [...diagnostics, ...lints]

        /* 记录tsChecker的errors和warnings */
        tsMessagesResolver({
          errors: allMsgs
            .filter(msg => msg.severity === 'error')
            .map(msg => typescriptFormat(msg)),
          warnings: allMsgs
            .filter(msg => msg.severity === 'warning')
            .map(msg => typescriptFormat(msg))
        })
      }
    )
  }

  compiler.hooks.done.tap('done', async stats => {
    clearConsole()

    /* stats.toJson：将stats输出成需要的格式 */
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true
    })

    /**
     * 如果没有其他的错误则优先获取tsChecker结果
     * 将ts错误的优先级放在其他错误之后
     */
    if (isTs && statsData.errors.length === 0) {
      console.log(
        chalk.yellow(
          'Files successfully emitted, waiting for typecheck results...'
        )
      )
      const messages = await tsMessagesPromise
      statsData.errors.push(...messages.errors)
      statsData.warnings.push(...messages.warnings)

      /**
       * 把errors和warnings推入compilation实例中
       * 保证refresh window之后可以将这些errors和warning重新推给socket client
       */
      stats.compilation.errors.push(...messages.errors)
      stats.compilation.warnings.push(...messages.warnings)

      /* 向socket client推送消息 */
      if (messages.errors.length > 0) {
        const devServer = getDevServer()
        devServer.sockWrite(devServer.sockets, 'errors', messages.errors)
      } else if (messages.warnings.length > 0) {
        const devServer = getDevServer()
        devServer.sockWrite(devServer.sockets, 'errors', messages.warnings)
      }

      clearConsole()
    }

    output(statsData)
  })

  return compiler
}
