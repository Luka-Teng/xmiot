const chalk = require('chalk')
const format = require('util').format
const ora = require('ora')

/**
 * Log a `message` to the console.
 *
 * @param {String} message
 */

exports.log = (...args) => {
  const msg = format.apply(format, args)
  console.log('\n', chalk.white('LOG'), msg)
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

exports.fatal = (...args) => {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)
  console.error('\n', chalk.red('ERROR'), msg)
  process.exit(1)
}

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */

exports.success = (...args) => {
  const msg = format.apply(format, args)
  console.log('\n', chalk.green('SUCCESS'), msg)
}

/**
 * Log a warning `message` to the console and exit.
 *
 * @param {String} message
 */

exports.warn = (...args) => {
  const msg = format.apply(format, args)
  console.log('\n', chalk.yellow('WARNING'), msg)
}

/**
 * Log a loading `message` to the console and exit.
 *
 * @param {String} message
 */

exports.load = (() => {
  const spinner = ora()
  return (...args) => {
    const msg = format.apply(format, args)
    spinner.text = msg
    spinner.start()
    return spinner.stop.bind(spinner)
  }
})()
