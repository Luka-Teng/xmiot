import {
  getConfigFlag,
  getUrlFlag,
  getPromise,
  handlePath,
  sortAndfilterObject
} from '../../utils'
import { mockError, mockSuccess } from '../../mockResponse'

const VERBS = ['get', 'post', 'delete', 'put']

class MockAdapter {
  handlers = {}

  baseURLs = []

  constructor (net) {
    net.mockBase = (...urls) => {
      this.baseURLs = urls
    }

    VERBS.forEach(verb => {
      net[verb] = (url, { data, params } = {}) => {
        const configFlag = getConfigFlag({ url, method: verb, data, params })
        /**
         * type: once回复一次， normal正常回复
         * @param { number } options.delay
         * @param { string } options.errorMessage
         */
        const reply = (type = 'normal') => (code, response, options = {}) => {
          if (code === undefined) {
            throw new Error('code is a must')
          }
          this.addHandler(configFlag, { code, response, type, options })
          return net
        }

        return {
          reply: reply(),
          replyOnce: reply('once')
        }
      }
    })
  }

  getHandlerFromConfig = config => {
    const tempConfig = { ...config }
    const { baseURL, url } = tempConfig

    // 对data排序并反序列化
    if (tempConfig.data) {
      tempConfig.data = sortAndfilterObject(
        typeof config.data === 'string' ? JSON.parse(config.data) : config.data,
        []
      )
    }

    // 对params排序并反序列化
    if (tempConfig.params) {
      tempConfig.params = sortAndfilterObject(config.params, [])
    }

    /* 整合baseURL和url到属性url上 */
    if (tempConfig.baseURL) {
      tempConfig.url =
        url.indexOf(baseURL) === 0 ? url : handlePath(baseURL).join(url).url
      Reflect.deleteProperty(tempConfig, 'baseURL')
    }

    /* 移除baseURL */
    this.baseURLs.some(baseURL => {
      if (tempConfig.url.includes(baseURL)) {
        tempConfig.url = tempConfig.url.replace(baseURL, '')
        return true
      }
      return false
    })

    const configFlag = getConfigFlag(tempConfig)
    const urlFlag = getUrlFlag(tempConfig)
    let flag = null
    /* 匹配configFlag的优先级高 */
    if (this.handlers[configFlag]) {
      flag = configFlag
      return { flag, handler: this.handlers[configFlag] }
    }
    if (this.handlers[urlFlag]) {
      flag = urlFlag
      return { flag, handler: this.handlers[urlFlag] }
    }
    return { flag: null, handler: null }
  }

  addHandler = (key, value) => {
    this.handlers[key] = this.handlers[key] || []
    const temp = this.handlers[key]

    if (
      !temp.some(handler => handler.type === 'normal') ||
      value.type === 'once'
    ) {
      temp.push(value)
    }
  }

  validateStatus = status => status >= 200 && status < 300

  deleteHandler = key => {
    Reflect.deleteProperty(this.handlers, key)
  }

  /*
   * pass会过滤掉handler不存在的情况，所以handler一定存在
   * adapter会自动销毁空数组key，因此不存在topHandler不存在的情况
   */
  adapter = config => {
    const { handler, flag } = this.getHandlerFromConfig(config)
    const reply = handler[0]
    const { code, response, options, type } = reply
    const { promise, res, rej } = getPromise()
    const send = () => {
      if (this.validateStatus(code)) {
        res(
          mockSuccess({
            data: response,
            status: code,
            config: config
          })
        )
        return
      }
      rej(
        mockError({
          response: { data: response },
          status: code,
          config: config,
          message: options.errorMessage
        })
      )
    }

    if (type === 'once') handler.splice(0, 1)

    if (handler.length === 0) this.deleteHandler(flag)

    if (options.delay) {
      setTimeout(() => {
        send()
      }, options.delay)
    } else {
      send()
    }

    return promise
  }

  pass = config => {
    return !!this.getHandlerFromConfig(config).handler
  }
}

export default MockAdapter
