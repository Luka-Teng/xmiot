import { getOriginWithPath, isOverTime } from './utils'
import axios from 'axios'

const publicAxios = axios.create()

// 对http请求的缓存
const cacheAdapter = () => {
  const cache = {}
  window.cache = cache
  return config => {
    const flagUrl = getOriginWithPath(config.url) + '&' + config.method
    const _cache = cache[flagUrl]

    // 如果存在缓存且未过期则直接输出缓存
    if (_cache && !isOverTime(_cache.beginnig, _cache.timeout)) {
      return new Promise((resolve, reject) => {
        resolve(_cache.data)
      })
    }

    // 如果不存在缓存或者过期则重新请求，并且记入缓存初始时间
    return new Promise((resolve, reject) => {
      config.adapter = publicAxios.defaults.adapter
      resolve(
        publicAxios(config).then(data => {
          cache[flagUrl] = {
            data,
            timeout: config.needParams.timeout,
            beginnig: +new Date()
          }
          return data
        })
      )
    })
  }
}

const _cacheAdapter = cacheAdapter()

export { _cacheAdapter as cacheAdapter, publicAxios }