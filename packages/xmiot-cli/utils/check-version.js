const semver = require('semver')
const chalk = require('chalk')
const packageConfig = require('../package.json')
const axios = require('axios')

module.exports = done => {
  // Ensure minimum supported node version is used
  if (!semver.satisfies(process.version, packageConfig.engines.node)) {
    return console.log(
      chalk.red(
        '  You must upgrade node to >=' +
          packageConfig.engines.node +
          '.x to use iot-cli'
      )
    )
  }

  // 判断iot-cli是否可以更新
  axios
    .get('https://registry.npmjs.org/xmiot-cli')
    .then(res => {
      const lastestVersion = res.data['dist-tags'].latest
      const localVersion = packageConfig.version
      const name = packageConfig.name
      if (semver.lt(localVersion, lastestVersion)) {
        console.log(chalk.yellow(`  A newer version of ${name} is available.`))
        console.log()
        console.log('  latest:    ' + chalk.green(lastestVersion))
        console.log('  installed: ' + chalk.red(localVersion))
        console.log()
      }
    })
    .catch(err => {
      console.log(chalk.red(err))
    })
    .then(() => {
      done()
    })
}
