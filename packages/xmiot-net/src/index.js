import { promiseSequence, getUrlFlag } from './utils'
import { cancelResponse } from './mockResponse'
import { cacheAdapter, publicAxios } from './adapters'
// import axios from 'axios'

/*
 * pre(config): 提供请求发送前的钩子函数
 * postSuccess(response): 提供响应成功后的钩子函数
 * postError(err): 提供响应失败后的钩子函数
 * 以上三个方法需要返回对应值
 * 用法:
 * let net = new Net(axiosInstance, preventRepeat)
 * axiosInstance: axios实例
 * preventRepeat: 是否阻止重复提交
 * 开发要点:
 * cancel: cancel可以取消请求发送，并且不会走adapter, request拦截器return reject有同样效果
 * adapter: 是请求的处理中心，可以根据更换adapter来实现mock
 */

/*
  * 目前整理逻辑比较乱，需要在后续做个梳理改进，包扩加入拦截层概念。
  * 拦截层包括可跳过拦截层，不可跳过拦截层。
  */

class Net {
  // 针对于拦截器
  requestHandlers = []
  responseHandlers = {
    success: [],
    err: []
  }

  /*
   * 针对于adapters的委托
   */
  adapterHandlers = {}

  axiosInstance = null

  constructor (instance, preventRepeat = false) {
    if (instance === undefined) {
      throw new Error('需要axios实例')
    }
    this.axiosInstance = instance

    // 第一道拦截，请求锁
    if (preventRepeat) {
      this.preventRepeat()
    }

    // 第二道拦截，请求重发挂载
    this.addingResend()

    // 初始化，并挂载adapter拦截
    this.init()
  }

  init = () => {
    // 依次执行前置拦截中间函数
    this.axiosInstance.interceptors.request.use(
      async config => {
        const result = await promiseSequence(
          this.requestHandlers,
          (handler, stop, _config = config) => handler(_config, stop)
        )
        return result || config
      },
      async err => {
        return Promise.reject(err)
      }
    )

    // 依次执行后置拦截中间函数
    this.axiosInstance.interceptors.response.use(
      async response => {
        const result = await promiseSequence(
          this.responseHandlers.success,
          (handler, stop, _response = response) => handler(_response, stop)
        )
        return result || response
      },
      async err => {
        const result = await promiseSequence(
          this.responseHandlers.err,
          (handler, stop, _err = err) => handler(_err, stop)
        )
        if (!result) return Promise.reject(err)
        return result
      }
    )

    // adapters配置
    this.handleAdapter()
  }

  pre = fn => {
    this.requestHandlers.push(fn)
    return this
  }

  postSuccess = fn => {
    this.responseHandlers.success.push(fn)
    return this
  }

  postError = fn => {
    this.responseHandlers.err.push(fn)
    return this
  }

  // 防止重复提交
  preventRepeat = () => {
    const pending = []
    const handleQueues = (config, cancel = false) => {
      const flagUrl = getUrlFlag(config)
      const flagIndex = pending.indexOf(flagUrl)
      if (flagIndex >= 0) {
        if (cancel) {
          console.log(flagUrl + ' : ' + 'cancel')
          // 仿造response返回类型，返回取消的错误
          throw cancelResponse({
            url: config.url,
            method: config.method
          })
        } else {
          pending.splice(flagIndex, 1)
          console.log(flagUrl + ' : ' + 'removed')
        }
      } else {
        console.log(flagUrl + ' : ' + 'add')
        pending.push(flagUrl)
      }
    }

    this.pre(config => {
      handleQueues(config, true)
      return config
    })
      .postSuccess(response => {
        handleQueues(response.config)
        return response
      })
      .postError((err, stop) => {
        if (err.statusText !== 'cancel') {
          handleQueues(err.config)
        }
        return Promise.reject(err)
      })
  }

  // 为每个response的config挂载重发方法
  addingResend = () => {
    this.postSuccess(response => {
      const { config } = response
      config.resend = () => publicAxios(config)
      return response
    }).postError(err => {
      const { config } = err
      config.resend = () => publicAxios(config)
      return Promise.reject(err)
    })
  }

  /*
   * 用于处理不同adapters的调度策略
   * 调度向adapter传递参数，统一使用config.needParams
   */
  handleAdapter = () => {
    this.pre((config, stop) => {
      const flagUrl = getUrlFlag(config)
      const handler = this.adapterHandlers[flagUrl]
      if (handler) {
        switch (handler.type) {
          case 'cache':
            stop()
            config.adapter = cacheAdapter
            config.needParams = { timeout: handler.timeout }
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
    this.adapterHandlers[urlFlag] = options
  }
}

export default Net

// const net = new Net(axios, false)
// window.net = net
// window.axios = axios
