import { publicAxios } from '../adapters'
import { getUrlFlag } from '../utils'

export default (() => {
  const options = {}

  return net => {
    net.postError(async (err, stop) => {
      const config = err.config
      const urlFlag = getUrlFlag(config)
      let times = options[urlFlag]

      // 网络原因再重新加载
      if (times && !err.response) {
        while (true) {
          try {
            const result = await publicAxios(config)
            stop()
            return net.run('postSuccess', result)
          } catch (e) {
            if (--times === 0) return e
          }
        }
      }
      return err
    })

    net.onResend = ({ url, method, times = 1 } = {}) => {
      const urlFlag = getUrlFlag({ url, method })
      options[urlFlag] = times
    }
  }
})()
