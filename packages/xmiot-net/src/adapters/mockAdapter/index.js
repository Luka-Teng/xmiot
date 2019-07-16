import { getConfigFlag, getUrlFlag, getPromise, handlePath, deepAssign } from '../../utils'
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

    const getResultByFlag = flags => {
      for (let i in flags) {
        const flag = flags[i]
        if (this.handlers[flag]) {
          return { flag, handler: this.handlers[flag] }
        }
      }
      return { flag: null, handler: null }
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
    const fuzzyConfigFlag = getConfigFlag({
      ...tempConfig,
      data: undefined,
      params: undefined
    })
    const urlFlag = getUrlFlag(tempConfig)

    /* 匹配configFlag的优先级高 */
    return getResultByFlag([configFlag, fuzzyConfigFlag, urlFlag])
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
    const { code, options, type } = reply
    let response = reply.response

    /* response需要mutable化 */
    response = deepAssign(response)

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
