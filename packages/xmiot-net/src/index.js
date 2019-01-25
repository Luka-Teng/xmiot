import { getUrlFlag } from './utils'
import { cacheAdapter } from './adapters'
import WaterfallHook from './netHook/waterfallHook'
import axios from 'axios'

import preventRepeat from './middlewares/preventRepeat'
import addResend from './middlewares/addResend'
import unexpectedError from './middlewares/unexpectedError'

/*
 * pre(config): 提供请求发送前的钩子函数
 * postSuccess(response): 提供响应成功后的钩子函数
 * postError(err): 提供响应失败后的钩子函数
 * 以上三个方法需要返回对应值（借鉴tapable的waterfall模式，没有返回值的是否返回上一个返回值）
 * 用法:
 * let net = new Net(axiosInstance, preventRepeat)
 * axiosInstance: axios实例
 * preventRepeat: 是否阻止重复提交
 * 开发要点:
 * cancel: cancel可以取消请求发送，并且不会走adapter, request拦截器return reject有同样效果
 * adapter: 是请求的处理中心，可以根据更换adapter来实现mock
 */

/*
 * TODO... v1.1.0
 * 目前整理逻辑比较乱，需要在后续做个梳理改进，包扩加入拦截层概念。
 * 拦截层请求拦截层，响应拦截层，请求响应拦截层
 * 每个拦截层可以分为可跳过拦截层和不可跳过拦截层
 * pre中调用stop，过滤栈：可跳过拦截层 -> 请求拦截层 -> 请求响应拦截层
 * post中调用stop，过滤栈：可跳过拦截层 -> 响应拦截层 -> 请求响应拦截层
 * mockResponse优化，针对无响应条件
 * 增加一层错误拦截，去处理是否是网络请求的错误还是什么其他错误
 * TODO... v1.2.0
 * 加入mock
 * 加入parallehook 来作用于业务无关的逻辑 log类的
 */

class Net {
  // 针对于拦截器
  requestHandlers = new WaterfallHook('config')
  responseHandlers = {
    success: new WaterfallHook('response'),
    error: new WaterfallHook('error')
  }

  // 针对于adapters的委托
  adapterOptions = {}

  axiosInstance = null

  constructor (instance, preventRepeat = false) {
    if (instance === undefined) {
      throw new Error('需要axios实例')
    }
    this.axiosInstance = instance

    // 初始化，并挂载adapter拦截
    this.init(preventRepeat)
  }

  init = _preventRepeat => {
    // 为后续parallel hooks做基础
    const run = (type, params) => {
      const handlers =
        type === 'pre'
          ? this.requestHandlers
          : type === 'postSuccess'
            ? this.responseHandlers.success
            : this.responseHandlers.error

      try {
        return handlers.run(params)
      } catch (e) {
        throw e
      } finally {
        // 平行钩子
      }
    }

    // 依次执行前置拦截中间函数
    this.axiosInstance.interceptors.request.use(
      async config => {
        const result = await run('pre', config)
        return result
      },
      async error => {
        return Promise.reject(error)
      }
    )

    // 依次执行后置拦截中间函数
    this.axiosInstance.interceptors.response.use(
      async response => {
        const result = await run('postSuccess', response)
        return result
      },
      async error => {
        const result = await run('postError', error)
        return result.notError ? result : Promise.reject(result)
      }
    )

    // 开启请求锁
    if (_preventRepeat) {
      preventRepeat(this)
    }

    // adapters配置
    this.handleAdapter()

    // 添加默认配置
    this.applyMiddlewares()
  }

  applyMiddlewares = () => {
    // 处理非网络错误
    unexpectedError(this)

    // 增加重发属性
    addResend(this)
  }

  /* 请求拦截层 */
  pre = fn => {
    this.requestHandlers.listen(fn)
    return this
  }

  /* 响应成功拦截层 */
  postSuccess = fn => {
    this.responseHandlers.success.listen(fn)
    return this
  }

  /* 响应失败拦截层 */
  postError = fn => {
    this.responseHandlers.error.listen(fn)
    return this
  }

  /* 请求&响应成功拦截层 */
  preAndPostSuccess = (fn1, fn2) => {
    this.requestHandlers.connect(this.responseHandlers.success)(fn1, fn2)
    return this
  }

  /* 请求&响应失败拦截层 */
  preAndPostError = (fn1, fn2) => {
    this.requestHandlers.connect(this.responseHandlers.error)(fn1, fn2)
    return this
  }

  /*
   * 用于处理不同adapters的调度策略
   * 调度向adapter传递参数，统一使用config.needParams
   */
  handleAdapter = () => {
    this.pre((config, stop) => {
      const flagUrl = getUrlFlag(config)
      const options = this.adapterOptions[flagUrl]
      if (options) {
        switch (options.type) {
          case 'cache':
            stop()
            config.adapter = cacheAdapter
            config.needParams = { timeout: options.timeout }
            break

          default:
            break
        }
      }
      return config
    })
  }

  // 缓存
  onCache = ({ url, method, timeout = 3600000 } = {}) => {
    if (!url || !method) {
      throw new Error('缺少参数url或method')
    }
    const urlFlag = getUrlFlag({ url, method })
    const options = {
      timeout,
      type: 'cache'
    }
    this.adapterOptions[urlFlag] = options
  }
}

export default Net

const net = new Net(axios, true)
window.net = net
window.axios = axios
