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
    const _spawn = spawn(
      cmd,
      args,
      mergeOptions
    )

    // pipe模式下如果错误会reject错误信息
    if (mergeOptions.stdio === 'pipe') {
      _spawn.stderr.on('data', (data) => {
        console.log(data.toString())
        // reject(data.toString().trim())
      })
    }

    // code不是1的情况下判断错误
    _spawn.on('close', (code) => {
      code !== 0 ? reject() : resolve()
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
        cwd: process.cwd()
      },
      options
    )
  )
  return result && result.toString().trim()
}
exports.execCommand = execCommand

exports.npmInstall = cwd => {
  return runCommand('npm', ['install'], {
    cwd
  }).then(() => {
    logger.success('安装依赖成功')
  })
}

exports.lernaBoot = cwd => {
  return runCommand('lerna', ['bootstrap'], {
    cwd
  }).then(() => {
    logger.success('依赖安装成功')
  })
}

// git的一些列操作
exports.git = {
  // git的add操作，默认添加所有文件
  add (...files) {
    if (files.length === 0) files.push('.')
    return runCommand('git', ['add', ...files]).catch(e => {
      logger.fatal(e)
    })
  },

  // git的commit操作
  commit (m) {
    m = m || 'Luka'
    return runCommand('git', ['commit', '-m', `"${m}"`]).catch(e => {
      logger.fatal(e)
    })
  },

  // git的push操作
  push () {
    return runCommand('git', ['push']).catch(e => {
      logger.fatal(e)
    })
  },

  // git的pull操作
  pull () {
    return runCommand('git', ['pull']).catch(e => {
      logger.fatal(e)
    })
  }
}
