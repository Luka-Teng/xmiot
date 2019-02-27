import { getUrlFlag } from '../utils'
import { cancelResponse } from '../mockResponse'

// 防止重复提交
export default net => {
  const pending = []

  const handlePre = config => {
    const urlFlag = getUrlFlag(config)
    const flagIndex = pending.indexOf(urlFlag)
    if (flagIndex >= 0) {
      console.log(urlFlag + ' : cancel')
      // 仿造response返回类型，返回取消的错误
      throw cancelResponse(config)
    } else {
      console.log(urlFlag + ' : add')
      pending.push(urlFlag)
    }
  }

  const handlePost = config => {
    const urlFlag = getUrlFlag(config)
    const flagIndex = pending.indexOf(urlFlag)
    if (flagIndex >= 0) {
      console.log(urlFlag + ' : removed')
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
