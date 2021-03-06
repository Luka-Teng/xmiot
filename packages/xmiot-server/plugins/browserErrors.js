/**
 * 干两件事
 * 1. 处理tsCheck的errors和warning的socket
 * 2. 统一处理浏览器的错误显示（目前仅需要在浏览器控制台输出）
 * 对于第二个问题暂时使用webpack-dev-server/clinet的overlay
 */
const SockJS = require('sockjs-client')
const url = require('url')

/*
 * 连接webpack-dev-server的scoket
 * 所起的webpack-dev-server都是在ws://xxxx/sockjs-node
 */
const connection = new SockJS(
  url.format({
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    port: window.location.port,
    // Hardcoded in WebpackDevServer
    pathname: '/sockjs-node'
  })
)

/* 浏览器环境不需要node的色彩显示 */
const getCleanText = text => {
  const pattern = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
  return text.replace(pattern, '')
}

// Handle messages from the server.
connection.onmessage = e => {
  var message = JSON.parse(e.data)
  switch (message.type) {
    case 'hash':
      console.info(`[构建完成]: ${message.data}`)
      break
    case 'ok':
      break
    case 'content-changed':
      window.location.reload()
      break
    case 'warnings':
      message.data.map(d => console.warn(getCleanText(d)))
      break
    case 'errors':
      console.error(getCleanText(message.data[0]))
      break
    default:
      break
  }
}
