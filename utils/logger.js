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
  console.log(chalk.white('LOG'), msg, '\n')
}

/**
 * Log an error `message` to the console and exit.
 *
 * @param {String} message
 */

exports.fatal = (...args) => {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)
  console.error(chalk.red('ERROR'), msg, '\n')
  process.exit(1)
}

/**
 * Log a success `message` to the console and exit.
 *
 * @param {String} message
 */

exports.success = (...args) => {
  const msg = format.apply(format, args)
  console.log(chalk.green('SUCCESS'), msg, '\n')
}

/**
 * Log a warning `message` to the console and exit.
 *
 * @param {String} message
 */

exports.warn = (...args) => {
  const msg = format.apply(format, args)
  console.log(chalk.yellow('WARNING'), msg, '\n')
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
    spinner.text = msg + '\n'
    spinner.start()
    return spinner.stop.bind(spinner)
  }
})()
