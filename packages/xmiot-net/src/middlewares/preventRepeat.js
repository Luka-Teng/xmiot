import { getUrlFlag } from '../utils'
import { cancelResponse } from '../mockResponse'

// 防止重复提交
export default net => {
  const pending = []
  const handleQueues = (config, cancel = false) => {
    const flagUrl = getUrlFlag(config)
    const flagIndex = pending.indexOf(flagUrl)
    if (flagIndex >= 0) {
      if (cancel) {
        console.log(flagUrl + ' : cancel')
        // 仿造response返回类型，返回取消的错误
        throw cancelResponse({
          url: config.url,
          method: config.method
        })
      } else {
        pending.splice(flagIndex, 1)
        console.log(flagUrl + ' : removed')
      }
    } else {
      console.log(flagUrl + ' : add')
      pending.push(flagUrl)
    }
  }

  net
    .pre(config => {
      handleQueues(config, true)
      return config
    })
    .postSuccess(response => {
      handleQueues(response.config)
      return response
    })
    .postError((error, stop) => {
      if (error.statusText !== 'cancel') {
        handleQueues(error.config)
      }
      return error
    })
}
