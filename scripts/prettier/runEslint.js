const CLIEngine = require("eslint").CLIEngine
const { eslintRules } = require('./config')

const extentions = ['.js', '.jsx']

const cli = new CLIEngine({
  parser: 'babel-eslint',
  useEslintrc: false,
  rules: eslintRules,
  extentions,
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

const isJs = (file) => {
  return extentions.some(extention => file.endsWith(extention))
}

const lint = (file) => {
  /* 文件类型检查 */
  if (!isJs(file)) return

  var report = cli.executeOnFiles([file])
  CLIEngine.outputFixes(report)
  const messages = report.results[0].messages
  const fatalMessage = getFatalMessage(messages)
  if (fatalMessage) {
    throw fatalMessage.message
  }
}

module.exports = lint