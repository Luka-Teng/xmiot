/*
 * 1. 判断是否能解析仓库地址。
 * 2. 判断是否commit
 * 3. 判断是否npm login
 * 4. 判断该包是否存在，存在的话是否是包的所有者，是的话判断版本增加
 */

const {execCommand} = require('../utils/runCommand')
const logger = require('../utils/logger')
const git = require('simple-git/promise')
const axios = require('axios')

// 判断git地址是否有效
const gitConnectTest = async () => {
  let remoteUrl = execCommand('git remote get-url --all origin')
  const pattern = /(?<=@).*(?=:)/
  remoteUrl = remoteUrl.match(pattern)[0]
  try {
    const stop = logger.load('测试git远程连接')
    await axios.get('http://' + remoteUrl)
    stop()
    logger.success('git远程连接成功')
  } catch (e) {
    logger.fatal('无法连接到远程地址')
  }
}

// 判断是否还有未提交文件
const gitCommitTest = async () => {
  try {
    const {files, staged} = await git().status()
    if (files.length > 0 || staged > 0) {
      logger.fatal('还存在未提交文件')
    }
  } catch (e) {
    throw e
  }
}

// 判断是否npm登录，判断
git().raw([
  'log',
  'master',
  '^origin/master',
  '--name-only'
]).then(data => console.log(data))