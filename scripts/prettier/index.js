const fs = require('fs-extra')
const path = require('path')

const runEslint = require('./runEslint')
const runTslint = require('./runTslint')

const file = process.argv[2]
const absoluteFile = path.resolve(process.cwd(), file)
let stats

try {
  stats = fs.statSync(absoluteFile)
} catch (e) {
  throw new Error(`找不到文件: ${absoluteFile}`)
}

if (!file || stats.isDirectory()) {
  throw new Error(`不允许时文件夹类型: ${absoluteFile}`)
}

runEslint(absoluteFile)
runTslint(absoluteFile)