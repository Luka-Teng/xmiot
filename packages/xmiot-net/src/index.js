import WaterfallHook from './netHook/waterfallHook'
import { CacheAdapter, MockAdapter } from './adapters'
import preventRepeat from './middlewares/preventRepeat'
import addResend from './middlewares/addResend'
import unexpectedError from './middlewares/unexpectedError'

/*
 * TODO... v1.2.1
 * 加入parallehook 来作用于业务无关的逻辑 log类的
 */

class Net {
  /* 针对于拦截器 */
  requestHandlers = new WaterfallHook('config')
  responseHandlers = {
    success: new WaterfallHook('response'),
    error: new WaterfallHook('error')
  }

  /* 注册过得adapter */
  registeredAdapters = []

  axiosInstance = null

  constructor (instance, preventRepeat = false) {
    if (instance === undefined) {
      throw new Error('需要axios实例')
    }
    this.axiosInstance = instance

    // 初始化，并挂载adapter拦截
    this.init(preventRepeat)
  }

  /* 为后续parallel hooks做基础 */
  run = (type, params) => {
    const handlers =
      type === 'pre'
        ? this.requestHandlers
        : type === 'postSuccess'
          ? this.responseHandlers.success
          : this.responseHandlers.error

    try {
      try {
        params.inQueue = type
      } catch {
        params = new Error(params)
        params.inQueue = type
      }
      return handlers.run(params)
    } catch (e) {
      throw e
    } finally {
      /* 平行钩子 */
    }
  }

  init = _preventRepeat => {
    /* 依次执行前置拦截中间函数 */
    this.axiosInstance.interceptors.request.use(
      async config => {
        const result = await this.run('pre', config)

        return this.handleAdapter(result)
      },
      async error => {
        return Promise.reject(error)
      }
    )

    /* 依次执行后置拦截中间函数 */
    this.axiosInstance.interceptors.response.use(
      async response => {
        const result = await this.run('postSuccess', response)
        return result
      },
      async error => {
        const result = await this.run('postError', error)

        /* 代表错误已经转化为正确队列 */
        if (result.inQueue === 'postSuccess') {
          return result
        }

        return Promise.reject(result)
      }
    )

    /* 注册Adapter */
    this.registerAdapter(new CacheAdapter(this), new MockAdapter(this))

    // /* 处理非网络/意外错误 */
    unexpectedError(this)

    /* 开启请求锁 */
    if (_preventRepeat) {
      preventRepeat(this)
    }

    // /* 增加重发属性 */
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

  /* 注册adapters */
  registerAdapter = (...adapters) => {
    this.registeredAdapters.push(...adapters)
  }

  /* 用于处理不同adapters的调度策略 */
  handleAdapter = config => {
    for (let adapter of this.registeredAdapters) {
      if (adapter.pass(config)) {
        config.adapter = adapter.adapter
        break
      }
    }
    return config
  }
}

export default Net
