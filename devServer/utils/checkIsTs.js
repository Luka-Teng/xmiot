const fs = require('fs')
const log = require('./log')

const checkIsTs = (entry) => {
  const jsPattern = /\.(js|jsx)$/
  const tsPattern = /\.(ts|tsx)$/

  const checkFile = (file) => {
    if (!fs.existsSync(file)) {
      log.fatal(`找不到入口文件: ${file}`)
    }
  }

  if (jsPattern.test(entry)) {
    checkFile(entry)
    return false
  }

  if (tsPattern.test(entry)) {
    checkFile(entry)
    return true
  }

  log.fatal('入口文件必须以ts, tsx, js, jsx结尾')
}

module.exports = checkIsTs