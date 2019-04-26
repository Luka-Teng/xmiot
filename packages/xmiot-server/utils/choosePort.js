const getPort = require('get-port')
const inquirer = require('inquirer')
const chalk = require('chalk')

module.exports = async (port, host, cb) => {
  try {
    const _port = await getPort({ port: [port, 3001, 3002], host })

    if (port !== _port) {
      const question = {
        type: 'confirm',
        name: 'changePort',
        message:
          chalk.yellow(`the default port( ${port} ) has been occupied`) +
          `\n\nWould you like to run the app on another port( ${_port} ) instead?`,
        default: true
      }
      const answer = await inquirer.prompt(question)
      if (answer.changePort) {
        cb(_port)
      }
    } else {
      cb(_port)
    }
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}
