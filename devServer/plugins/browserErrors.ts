/**
 * 干两件事
 * 1. 处理tsCheck的errors和warning的socket
 * 2. 统一处理浏览器的错误显示（目前仅需要在浏览器控制台输出） 
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
    pathname: '/sockjs-node',
  })
)

// Handle messages from the server.
connection.onmessage = (e) => {
  var message = JSON.parse(e.data);
  switch (message.type) {
    case 'hash':
      console.warn(`current Hash: ${message.data}`)
      break;
    case 'still-ok':
    case 'ok':
      
      break;
    case 'content-changed':
      window.location.reload();
      break;
    case 'warnings':
      
      break;
    case 'errors':
      
      break;
    default:
      break;
  }
}