const chalk = require('chalk')
const format = require('util').format

/**
 * Prefix.
 */

const prefix = '   xmiot-cli'
const sep = chalk.gray('·')

/**
 * Log a `message` to the console.
 *
 * @param {String} message
 */

exports.log = (...args) => {
  const msg = format.apply(format, args)
  console.log('\n', chalk.white(prefix), sep, msg)
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

exports.fatal = (...args) => {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)
  console.error('\n', chalk.red(prefix), sep, msg)
  process.exit(1)
}

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */

exports.success = (...args) => {
  const msg = format.apply(format, args)
  console.log('\n', chalk.white(prefix), sep, msg)
}

/**
 * Log a warning `message` to the console and exit.
 *
 * @param {String} message
 */

exports.warn = (...args) => {
  const msg = format.apply(format, args)
  console.log('\n', chalk.yellow(prefix), sep, msg)
}
