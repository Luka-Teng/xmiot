/**
 * tsChecker errors和warnings的输出格式
 * 后续必须优化
 */
module.exports = (msg) => {
  return `${msg.file}\n${msg.content}`
}