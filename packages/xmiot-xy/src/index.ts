import { getPromise, checkVersion } from './utils'
/**
 * public api:
 *
 * invoke a native function
 * -- const call = xy.call(functionName, params)
 * get the result or error
 * -- call.then((result) => {...}).catch((err) => {...})
 *
 * listen a event
 * -- const event = xy.on(eventName, callback)
 *
 * private api
 */

/* 初始化hybrid对象，用户监听事件回调 */
window.hybrid = {}

/* 初始化JSBridge, 原生方法挂载对象 */
window.JSBridge = window.JSBridge || {}

/* 初始化nativeCallback对象，调用原生反馈回调 */
window.nativeCallback = {}

/* 初始化 */
let callbackIndex = 0

class XY {
  constructor () {
    // 确认sdk的版本信息
    checkVersion()
  }

  // 注册callback，并在运行后自动注销
  private registerCallBacks (...callbacks: Function[]) {
    if (callbacks.length < 1) {
      throw new Error('registerCallBacks需要至少一个回调参数')
    }

    /* 遍历三次，尚待优化 */
    const callbackNames = callbacks.map(() => `cb${callbackIndex++}`)
    callbackNames.forEach((name, index) => {
      window.nativeCallback[name] = (...args: any[]) => {
        callbacks[index](...args)
        callbackNames.forEach(callbackName => {
          delete window.nativeCallback[callbackName]
        })
      }
    })
    return callbackNames
  }

  public call (functionName: string, params: genObject = {}): Promise<any> {
    // 错误边界
    if (!window.JSBridge.nativeCallback) {
      throw new Error('请在native环境中使用sdk')
    }
    if (typeof functionName !== 'string') {
      throw new Error('方法名必须为字符串')
    }

    const { promise, res, rej } = getPromise()

    // 将回调方法注册入回调队列
    const [cb1, cb2] = this.registerCallBacks(res, rej)

    // 调用native方法
    window.JSBridge.nativeCallback(params, functionName, cb1, cb2)

    return promise
  }

  public on (functionName: string, callback: Function) {
    window.hybrid[functionName] = callback.bind(window.JSBridge)
  }
}

export default new XY()
