const yargs = require('yargs')
const path = require('path')
const log = require('../utils/log')
const checkIsTs = require('../utils/checkIsTs')

const argv = yargs
  .alias('v', 'version')
  .version('1.0.0')
  .usage('Usage: $0 module -l [ts / js]')
  .alias('l', 'language')
  .describe('l', '编译对象语言')
  .choices('f', ['ts', 'js'])
  .help('h')
  .argv

const entry = argv._[0] && path.resolve(process.cwd(), argv._[0])

if (!entry) {
  log.fatal('需要一个入口文件')
}

const isTs = argv.l === 'ts' || checkIsTs(entry)

module.exports = {
  entry,
  isTs
}