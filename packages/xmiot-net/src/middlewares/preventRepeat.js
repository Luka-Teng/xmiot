import { getUrlFlag } from '../utils'
import { cancelResponse } from '../mockResponse'

// 防止重复提交
export default net => {
  const pending = []

  const handlePre = config => {
    const flagUrl = getUrlFlag(config)
    const flagIndex = pending.indexOf(flagUrl)
    if (flagIndex >= 0) {
      console.log(flagUrl + ' : cancel')
      // 仿造response返回类型，返回取消的错误
      throw cancelResponse({
        url: config.url,
        method: config.method
      })
    } else {
      console.log(flagUrl + ' : add')
      pending.push(flagUrl)
    }
  }

  const handlePost = config => {
    const flagUrl = getUrlFlag(config)
    const flagIndex = pending.indexOf(flagUrl)
    if (flagIndex >= 0) {
      console.log(flagUrl + ' : removed')
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
      if (error.statusText !== 'cancel') {
        handlePost(error.config)
      }
      return error
    })
}
