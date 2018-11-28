/*
 * 1. 判断是否能解析仓库地址。
 * 2. 判断是否commit
 * 3. 判断是否npm login
 * 4. 判断该包是否存在，存在的话是否是包的所有者，是的话判断版本增加
 */

const {execCommand, runCommand, git} = require('../utils/runCommand')
const logger = require('../utils/logger')
const {eachWithNext} = require('../utils/function')
const simpletGit = require('simple-git/promise')
const axios = require('axios')
const path = require('path')
const semver = require('semver')
const fs = require('fs-extra')

// 判断git地址是否有效
const gitConnectTest = async () => {
  let remoteUrl = execCommand('git remote get-url --all origin')
  const pattern = /(?<=@).*(?=:)/
  remoteUrl = remoteUrl.match(pattern)[0]
  try {
    await axios.get('http://' + remoteUrl)
    logger.success('git远程连接成功')
  } catch (e) {
    logger.fatal('无法连接到远程地址')
  }
}

// 判断是否还有未提交文件
const gitCommitTest = async () => {
  try {
    const {files, staged} = await simpletGit().status()
    if (files.length > 0 || staged > 0) {
      logger.fatal('还存在未提交文件')
    }
  } catch (e) {
    throw e
  }
}

// 拉取代码
const gitPull = async () => {
  try {
    await git.pull()
  } catch (e) {
    logger.fatal(e)
  }
}

// 判断是否npm登录，判断提交文件中
const npmTest = async ({lastCommit}) => {
  let changedDirs = []
  let changedPkgs = []
  let user = null

  try {
    user = execCommand('npm whoami')
  } catch (e) {
    logger.fatal('请先登录npm')
  }

  // 获取需要被发布的包，返回包名数组
  try {
    changedDirs = await simpletGit().raw([
      'log',
      `${lastCommit}..HEAD`,
      '--name-only'  
    ]).then(data => {
      let result = []
      if (data) {
        result = Array.from(
          new Set(data
          .split('commit')
          .slice(1)
          .reduce((a, b) => {
            a.push(...b.split('\n').slice(6).filter(x => {
              return /^packages\//.test(x)
            }))
            return a
          }, [])
          .map(x => {
            // 包地址由字母数字，-，@组成
            return x.match(/(?<=^packages\/)[\w\d\-@]*(?=\/)/)[0]
          }))
        )
      }
      return result
    })
  } catch (e) {
    logger.log(e)
    logger.fatal('获取需要被发布的包失败')
  }

  // 如果存在被修改的文件,则添加被就改的包名
  if (changedDirs.length >= 0) {
    try {
      changedDirs.forEach(e => {
        const {name, version} = require(path.resolve('packages', e, 'package.json'))
        changedPkgs.push({name, version})
      })
    } catch (e) {
      logger.log(e)
      logger.fatal('存在包缺少package.json文件')
    }
  } 

  // 判断每个包的拥有者，和版本号
  if (changedPkgs.length >= 0) {
    await eachWithNext(changedPkgs, async (pkg, next) => {
      await axios
      .get(`https://registry.npmjs.org/${pkg.name}`)
      .then(res => {
        const lastestVersion = res.data['dist-tags'].latest
        const localVersion = pkg.version
        // 当前包只有一个maintainer
        const _user = res.data.maintainers[0].name
        if (user !== _user) {
          logger.fatal(`${pkg.name}非用户${user}维护`)
        }
        logger.success(`${pkg.name}是用户${user}维护`)
        if (semver.lt(localVersion, lastestVersion)) {
          logger.fatal(`${pkg.name}(${localVersion})版本号低于最新版本号${lastestVersion}`)
        }
        logger.success(`${pkg.name}(${localVersion})版本号验证通过`)
      })
      .catch(data => {
        if (data && data.response && data.response.data.error === 'Not found') {
          return logger.success(`${pkg.name}为新包`)
        }
        throw new Error('验证npm时候发生未知网络错误')
      })
      next()
    })
  }
}

const getLastCommit = () => {
  const packageJson = path.resolve('package.json')
  if (!fs.existsSync(packageJson)) {
    logger.fatal('为什么根目录连package.json都没有')
  } else {
    const json = require(packageJson)
    if (!json.lastCommit) {
      json.lastCommit = execCommand('git rev-parse HEAD')
      fs.outputJson(packageJson, json, {spaces: 2})
    }
    return json.lastCommit
  }
}

const setLastCommit = () => {
  const packageJson = path.resolve('package.json')
  if (!fs.existsSync(packageJson)) {
    logger.fatal('为什么根目录连package.json都没有')
  } else {
    const json = require(packageJson)
    json.lastCommit = execCommand('git rev-parse HEAD')
    fs.outputJson(packageJson, json, {spaces: 2})
  }
}

/*
 * cb一定要是async方法或者返回promise方法
 */
const loadingProcess = async (loadingMsg, completedMsg, cb) => {
  let stop = logger.load(loadingMsg)
  await cb()
  stop()
  logger.success(completedMsg)
}

const run = async () => {
  // 获取上次npm发布得到的commit
  let lastCommit = getLastCommit()

  // 测试是否能连上git
  await loadingProcess(
    '进行git连接测试测试',
    'git连接成功',
    gitConnectTest
  )

  // 查看是否有文件未提交
  await loadingProcess(
    '查看本地提交',
    '文件已提交',
    gitCommitTest
  )

  // 拉取远程最新代码
  await loadingProcess(
    '拉取代码',
    '代码拉取成功',
    gitPull
  )

  // 上次发布和这次发布之间所有commit进行遍历和包检查
  await loadingProcess(
    '进行npm用户和包检查',
    'npm检查成功',
    npmTest.bind(null, {lastCommit})
  )

  logger.success('开始发布')

  // 发布前后的commit进行比较，如果发生改变，则记录最新的commit号
  const beforeCommit = execCommand('git rev-parse HEAD')
  await runCommand('lerna', ['publish'], {stdio: 'inherit'})
  const afterCommit = execCommand('git rev-parse HEAD')
  if (beforeCommit !== afterCommit) setLastCommit()

  // 重新提交代码，提交内容为最新的npm push commitID
  await loadingProcess(
    '提交commitID',
    '提交成功，发版完毕',
    async () => {
      await git.add('package.json')
      await git.commit('reset commitID')
      await git.push()
    }
  )
}

run()