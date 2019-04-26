import { getUrlFlag } from '../utils'
import { cancelResponse } from '../mockResponse'

// 防止重复提交
export default net => {
  const pending = []
  let ignores = []

  net.prevent = (options) => {
    if (Object.prototype.toString(options) !== '[object Object]') {
      throw new Error('prevent 参数必须是对象')
    }
    ignores = options.ignores
  }

  const isIgnore = (config) => {
    return ignores.some((ignore) => {
      return getUrlFlag(config) === getUrlFlag({
        ...config,
        url: ignore
      })
    })
  }

  const handlePre = config => {
    if (isIgnore(config)) {
      return
    }
    const urlFlag = getUrlFlag(config)
    const flagIndex = pending.indexOf(urlFlag)
    if (flagIndex >= 0) {
      // 仿造response返回类型，返回取消的错误
      throw cancelResponse(config)
    } else {
      pending.push(urlFlag)
    }
  }

  const handlePost = config => {
    if (isIgnore(config)) {
      return
    }
    const urlFlag = getUrlFlag(config)
    const flagIndex = pending.indexOf(urlFlag)
    if (flagIndex >= 0) {
      pending.splice(flagIndex, 1)
    }
  }

  net
    .pre(config => {
      handlePre(config)
      return config
    })
    .postSuccess(response => {
      handlePost(response.config)
      return response
    })
    .postError(error => {
      if (error.statusText !== 'CANCEL') {
        handlePost(error.config)
      }
      return error
    })
}
