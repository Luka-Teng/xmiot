const { Linter } = require('tslint')
const fs = require('fs-extra')
const chalk = require('chalk')

const { tslintRules } = require('./config')
const { getScriptType } = require('../utils')

/* 由于tslint API无法直接识别tslintJson，需要转化格式 */
const parseLintConfig = config => {
  /* 转化rules */
  const parseRuleOptions = ruleConfigValue => {
    var ruleArguments
    var defaultRuleSeverity = 'error'
    var ruleSeverity = defaultRuleSeverity
    if (ruleConfigValue === undefined) {
      ruleArguments = []
      ruleSeverity = 'off'
    } else if (Array.isArray(ruleConfigValue)) {
      if (ruleConfigValue.length > 0) {
        ruleArguments = ruleConfigValue.slice(1)
        ruleSeverity = ruleConfigValue[0] === true ? defaultRuleSeverity : 'off'
      }
    } else if (typeof ruleConfigValue === 'boolean') {
      ruleArguments = []
      ruleSeverity = ruleConfigValue ? defaultRuleSeverity : 'off'
    } else if (typeof ruleConfigValue === 'object') {
      if (ruleConfigValue.severity !== undefined) {
        switch (ruleConfigValue.severity.toLowerCase()) {
          case 'default':
            ruleSeverity = defaultRuleSeverity
            break
          case 'error':
            ruleSeverity = 'error'
            break
          case 'warn':
          case 'warning':
            ruleSeverity = 'warning'
            break
          case 'off':
          case 'none':
            ruleSeverity = 'off'
            break
          default:
            console.warn('Invalid severity level: ' + ruleConfigValue.severity)
            ruleSeverity = defaultRuleSeverity
        }
      }
      if (ruleConfigValue.options !== undefined) {
        ruleArguments = Array.isArray(ruleConfigValue.options)
          ? ruleConfigValue.options
          : [ruleConfigValue.options]
      }
    }
    return {
      ruleArguments: ruleArguments,
      ruleSeverity: ruleSeverity
    }
  }

  const getMapRules = rules => {
    const map = new Map()
    if (!rules) return map

    for (let key in rules) {
      map.set(key, parseRuleOptions(rules[key]))
    }

    return map
  }

  return {
    extends: config.extends || [],
    linterOptions: config.linterOptions || {},
    rulesDirectory: config.extends || [],
    rules: getMapRules(config.rules),
    jsRules: getMapRules(config.jsRules)
  }
}

/* 寻找错误 */
const getErrorMessage = messages => {
  if (Object.prototype.toString.call(messages) !== '[object Array]') {
    throw new Error('messages必须为数组')
  }

  return messages.find(message => {
    return message.ruleSeverity
  })
}

const lint = file => {
  /* 文件类型检查 */
  if (getScriptType(file) !== 'ts') return

  console.log(chalk.green(`start to tslint: `), file)

  const fileContents = fs.readFileSync(file, 'utf8')
  const linter = new Linter({ fix: true })
  linter.lint(
    file,
    fileContents,
    parseLintConfig({
      rules: tslintRules
    })
  )
  const result = linter.getResult()

  /**
   * 如果发现无法修复的错误直接抛出
   * 作为只做代码分格的，一般很难碰到
   */
  const ErrorMessage = getErrorMessage(result.failures)
  if (ErrorMessage) {
    throw ErrorMessage.failure
  }

  console.log(chalk.green(`tslint done: `), file, '\n')
}

module.exports = lint
