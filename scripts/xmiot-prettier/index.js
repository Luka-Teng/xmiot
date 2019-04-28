const fs = require('fs-extra')
const path = require('path')

const runEslint = require('./runEslint')
const runTslint = require('./runTslint')
const runPrettier = require('./runPrettier')
const { getScriptType, matchFile } = require('./utils')
const { ignores } = require('./config')

const file = process.argv[2]
const absoluteFile = path.resolve(process.cwd(), file)

/* 过滤被ignore的文件 */
if (matchFile(ignores, absoluteFile)) {
  return
}

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