const fs = require('fs-extra')
const path = require('path')

const runEslint = require('./runEslint')
const runTslint = require('./runTslint')
const runPrettier = require('./runPrettier')
const { getScriptType } = require('../utils')

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

if (getScriptType(absoluteFile) === 'other') {
  return
}

if (getScriptType(absoluteFile) === 'ts') {
  runPrettier(absoluteFile)
  runTslint(absoluteFile)
  return
}

if (getScriptType(absoluteFile) === 'js') {
  runPrettier(absoluteFile)
  runEslint(absoluteFile)
}