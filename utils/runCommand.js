/*
 * spawn，返回process，能监听stdio
 * exec，一次性完成命令，返回最后一次stdout
 */

const spawn = require('child_process').spawn
const exec = require('child_process').execSync
const logger = require('./logger')

// command默认使用pipe，以便返回错误，spawn一般用于处理非返回性的
const runCommand = (cmd, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const mergeOptions = Object.assign(
      {
        cwd: process.cwd(),
        // 输出，错误不直接返回父进程，而是直接自己接管
        stdio: 'pipe',
        shell: true
      },
      options
    )
    const _spawn = spawn(cmd, args, mergeOptions)

    // pipe模式下如果错误会reject错误信息, git不可行，部分非错误也会输出
    if (mergeOptions.stdio === 'pipe') {
      _spawn.stderr.on('data', data => {
        reject(data.toString().trim())
      })
    }

    // code不是1的情况下判断错误
    _spawn.on('close', code => {
      resolve()
    })
  })
}
exports.runCommand = runCommand

// 用于处理简单返回的，同步返回
const execCommand = (cmd, options) => {
  const result = exec(
    cmd,
    Object.assign(
      {
        cwd: process.cwd(),
        stdio: 'pipe'
      },
      options
    )
  )
  return result && result.toString().trim()
}
exports.execCommand = execCommand

exports.npmInstall = cwd => {
  return runCommand('npm', ['install'], {
    cwd,
    stdio: 'inherit'
  }).then(() => {
    logger.success('安装依赖成功')
  })
}

exports.lernaBoot = cwd => {
  return runCommand('lerna', ['bootstrap'], {
    cwd,
    stdio: 'inherit'
  }).then(() => {
    logger.success('安装依赖成功')
  })
}

/*
 * git的一些列操作
 * git spawn或者exec子进程都会将输出输出到stderr，所以无法监听错误
 */
exports.git = {
  // git的add操作，默认添加所有文件
  add (...files) {
    if (files.length === 0) files.push('.')
    try {
      execCommand(`git add ${files.join(' ')}`)
    } catch (e) {
      console.log(e)
    }
  },

  // git的commit操作
  commit (m) {
    m = m || 'Luka'
    try {
      execCommand(`git commit -m "${m}"`)
    } catch (e) {}
  },

  // git的push操作
  push () {
    try {
      execCommand(`git push`)
    } catch (e) {}
  },

  // git的pull操作
  pull () {
    try {
      execCommand(`git pull`)
    } catch (e) {}
  },

  // 两次commit之间改变的文件, 默认只列出增加和修改的
  getChangedFiles (
    lastCommit = 'HEAD',
    currenCommit = 'HEAD',
    { types = ['A', 'M'] } = {}
  ) {
    try {
      const result = execCommand(
        `git diff ${lastCommit} ${currenCommit} --name-status`
      )
      const files = result.split('\n').reduce((a, b) => {
        const isInTypes = types.some(type => {
          return type === b[0]
        })
        if (isInTypes) {
          a.push(b.substr(1).trim())
        }
        return a
      }, [])
      return files
    } catch (e) {
      logger.fatal(e)
    }
  }
}
