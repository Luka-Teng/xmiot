const spawn = require('child_process').spawn
const logger = require('./logger')

const runCommand = (cmd, args, options) => {
  return new Promise((resolve, reject) => {
    const spwan = spawn(
      cmd,
      args,
      Object.assign(
        {
          cwd: process.cwd(),
          stdio: 'inherit',
          shell: true
        },
        options
      )
    )

    spwan.on('exit', () => {
      resolve()
    })
  })
}

exports.npmInstall = (cwd) => {
  return runCommand('npm', ['install'], {
    cwd
  }).then(() => {
    logger.success('安装依赖成功')
  })
}
