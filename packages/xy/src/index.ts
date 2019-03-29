import { getPromise } from './utils'
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
  // 注册callback，并在运行后自动注销
  private registerCallBack(callback: Function) {
    const callbackName = `cb${callbackIndex++}`
    window.nativeCallback[callbackName] = (...args: any[]) => {
      callback(...args)
      delete window.nativeCallback[callbackName]
    }
    return callbackName
  }

  private registerCallBacks(...callbacks: Function[]) {
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

  // 包装nativeFn，注册回调
  private wrapNativeFn(nativeFn: Function) {
    const { promise, res, rej } = getPromise()

    // 将回调方法注册入回调队列
    const [cb1, cb2] = this.registerCallBacks(res, rej)

    return (params: genObject) => {
      nativeFn(params, cb1, cb2)
      return promise
    }
  }

  private findNativeFn(name: string) {
    /**
     * TODOLSIT
     * 加入map，H5和nativeFn名字的映射
     */
    const fn = window.JSBridge[name]
    if (fn) {
      return fn.bind(window.JSBridge)
    }
    return null
  }

  public call(functionName: string, params: genObject = {}) {
    const fn = this.findNativeFn(functionName)

    if (!fn) {
      console.error('没有对应的nativeFn，或nativeFn尚未注入')
      return new Promise(() => {})
    }

    return this.wrapNativeFn(fn)(params)
  }

  public on(functionName: string, callback: Function) {
    window.hybrid[functionName] = callback.bind(window.JSBridge)
  }
}

export default new XY()
