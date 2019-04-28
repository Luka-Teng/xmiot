const prettier = require("prettier")
const { readFileSync, writeFileSync } = require("fs-extra")
const chalk = require('chalk')

const { prettierRules } = require('./config')

const _prettier = (file) => {
  console.log(chalk.green(`start to prettier: `), file)

  const code = readFileSync(file, "utf8")
  /* prettier错误就直接爆出 */
  const output = prettier.format(code, {
    ...prettierRules,
    filepath: file
  })

  if (output !== code) {
    writeFileSync(file, output)
  }

  console.log(chalk.green(`prettier done: `), file, '\n')
}

module.exports = _prettier