const spawn = require('child_process').spawn
const exec = require('child_process').execSync
const logger = require('./logger')

// command使用pipe，以便返回错误
const runCommand = (cmd, args, options) => {
  return new Promise((resolve, reject) => {
    const _spawn = spawn(
      cmd,
      args,
      Object.assign(
        {
          cwd: process.cwd(),
          // 直接输出到父进程的stdout，即控制台
          stdio: 'pipe',
          shell: true
        },
        options
      )
    )

    if (options && options.stdio === 'pipe') {
      _spawn.stderr.on('data', (data) => {
        reject(data.toString().trim())
      })
    }

    _spawn.on('close', () => {
      resolve()
    })
  })
}
exports.runCommand = runCommand

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
