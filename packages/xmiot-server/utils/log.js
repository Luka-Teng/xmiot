const chalk = require('chalk')

/**
 * Prefix.
 */
const prefix = 'devServer'
const sep = chalk.gray('·')

/**
 * Log a `message` to the console.
 */
exports.log = msg => {
  console.log('\n', chalk.white(prefix), sep, msg)
}

/**
 * Log an error `message` to the console and exit.
 */
exports.fatal = msg => {
  console.error('\n', chalk.red(prefix), sep, chalk.red(msg))
  process.exit(1)
}

/**
 * Log a success `message` to the console and exit.
 */

exports.success = msg => {
  console.log('\n', chalk.white(prefix), sep, msg)
}

/**
 * Log a warning `message` to the console and exit.
 */
exports.warn = msg => {
  console.log('\n', chalk.yellow(prefix), sep, chalk.yellow(msg))
}
