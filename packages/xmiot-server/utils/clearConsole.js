/* 用于清空终端log */
const isInteractive = process.stdout.isTTY

const clearConsole = () => {
  if (isInteractive) {
    process.stdout.write(
      process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
    )
  }
}

module.exports = clearConsole
