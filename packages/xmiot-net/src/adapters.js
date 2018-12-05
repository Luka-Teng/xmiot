import axios from 'axios'
import { getOriginWithPath } from './utils'

const commonInstance = axios.create()

// 对http请求的缓存
const cacheAdapter = () => {
  const cache = {}
  window.cache = cache
  return config => {
    const flagUrl = getOriginWithPath(config.url) + '&' + config.method
    const _cache = cache[flagUrl]
    if (_cache) {
      return new Promise((resolve, reject) => {
        resolve(_cache)
      })
    }
    return new Promise((resolve, reject) => {
      config.adapter = commonInstance.defaults.adapter
      resolve(
        commonInstance(config).then(data => {
          cache[flagUrl] = data
          return data
        })
      )
    })
  }
}

export default {
  cacheAdapter: cacheAdapter()
}
