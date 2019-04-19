const fs = require('fs')
const log = require('./log')

const checkTsOrJs = (entry) => {
  const jsPattern = /\.(js|jsx)$/
  const tsPattern = /\.(ts|tsx)$/

  const checkFile = (file) => {
    if (!fs.existsSync(file)) {
      log.fatal(`找不到入口文件: ${file}`)
    }
  }

  if (jsPattern.test(entry)) {
    checkFile(entry)
    return 'js'
  }

  if (tsPattern.test(entry)) {
    checkFile(entry)
    return 'ts'
  }

  log.fatal('入口文件必须以ts, tsx, js, jsx结尾')
}

module.exports = checkTsOrJs