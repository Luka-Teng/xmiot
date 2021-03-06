const yargs = require('yargs')
const path = require('path')
const log = require('../utils/log')
const checkIsTs = require('../utils/checkIsTs')

const argv = yargs
  .alias('v', 'version')
  .version('1.0.0')
  .usage('Usage: $0 module -l [ts / js] -w [workDir]')
  .alias('l', 'language')
  .describe('l', '编译对象语言')
  .choices('l', ['ts', 'js'])
  .alias('w', 'workDir')
  .describe('w', '主工作目录（用于主Babel编译，eslint，tslint，tsChecker）')
  .alias('b', 'baseDir')
  .describe('b', '构建的base路径，相对于cwd')
  .help('h').argv

const { baseDir = '.', workDir } = argv
const entry = argv._[0] && path.resolve(process.cwd(), baseDir, argv._[0])

if (!entry) {
  log.fatal('需要一个入口文件')
}

const isTs = argv.l === 'ts' || checkIsTs(entry)

module.exports = {
  entry,
  isTs,
  workDir
}
