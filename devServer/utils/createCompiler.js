/**
 * @param { object } webpack webpack构造函数
 * @param { boolean } isTs 是否是ts
 * @param { object } config webpack配置
 * 对compiler做预处理
 * 主要是push forkTsCheckerWebpackPlugin的errors和warnings
 */

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const chalk = require('chalk')
const clearConsole = require('./clearConsole')

/* 判断输出是否是终端 */
const isInteractive = process.stdout.isTTY
const _clearConsole = () => {
  if (isInteractive) clearConsole()
}


module.exports = ({
  webpack,
  config,
  isTs
}) => {
  /* 实例化错误的输出 */
  let compiler
  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red('Failed to compile.'))
    console.log()
    console.log(err.message || err)
    console.log()
    process.exit(1)
  }

  /* invalid会在webpack重新编译的过程中产生，这边直接输出compiler */
  compiler.hooks.invalid.tap('invalid', () => {
    _clearConsole()
    console.log('Compiling...');
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

    ForkTsCheckerWebpackPlugin
      .getCompilerHooks(compiler)
      .receive.tap('afterTypeScriptCheck', (diagnostics, lints) => {
        const allMsgs = [...diagnostics, ...lints]

        /* 记录tsChecker的errors和warnings */
        tsMessagesResolver({
          errors: allMsgs.filter(msg => msg.severity === 'error'),
          warnings: allMsgs
            .filter(msg => msg.severity === 'warning')
        })
      })
  }

  compiler.hooks.done.tap('done', async stats => {
    _clearConsole()

    /* stats.toJson：将stats输出成需要的格式 */
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
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
        devSocket.errors(messages.errors);
      } else if (messages.warnings.length > 0) {
        devSocket.warnings(messages.warnings);
      }

      _clearConsole()
    }
  })
}