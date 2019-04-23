/**
 * tsChecker errors和warnings的输出格式
 * 后续希望可以读取文件，输出代码位置片段
 * 交给岩岩或者启慧
 */
module.exports = msg => {
  const fileMsg = `file: ${msg.file}\n`
  const locationMsg = `location: line ${msg.line} column ${msg.character}\n`
  const errorMsg = `error: ${msg.content}\n`
  return fileMsg + locationMsg + errorMsg
}
