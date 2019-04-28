const CLIEngine = require("eslint").CLIEngine
const { eslintRules } = require('./config')
const { getScriptType } = require('../utils')
const chalk = require('chalk')

const cli = new CLIEngine({
  parser: 'babel-eslint',
  useEslintrc: false,
  rules: eslintRules,
  fix: true
})

const getFatalMessage = (messages) => {
  if (Object.prototype.toString.call(messages) !== '[object Array]') {
    throw new Error('messages必须为数组')
  }

  return messages.find((message) => {
    return message.fatal
  })
}

const lint = (file) => {
  /* 文件类型检查 */
  if (getScriptType(file) !== 'js') return

  console.log(chalk.green(`start to eslint: `), file)

  var report = cli.executeOnFiles([file])
  CLIEngine.outputFixes(report)
  const messages = report.results[0].messages
  const fatalMessage = getFatalMessage(messages)
  if (fatalMessage) {
    throw fatalMessage.message
  }

  console.log(chalk.green(`eslint done: `), file, '\n')
}

module.exports = lint