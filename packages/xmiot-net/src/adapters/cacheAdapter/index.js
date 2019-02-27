import {
  getUrlFlag,
  getConfigFlag,
  isOverTime,
  sortAndfilterObject
} from '../../utils'
import publicAxios from '../publicAxios'

class CacheAdapter {
  cache = {}

  constructor (net) {
    net.onCache = ({
      url,
      method,
      timeout = 3600000,
      ignoreParams = [],
      ignoreData = []
    } = {}) => {
      if (!url || !method) {
        throw new Error('缺少参数url或method')
      }
      const urlFlag = getUrlFlag({ url, method: method.toLocaleLowerCase() })
      this.cache[urlFlag] = {
        timeout,
        ignoreData,
        ignoreParams,
        store: {}
      }
    }
  }

  adapter = config => {
    const urlFlag = getUrlFlag(config)
    const _cache = this.cache[urlFlag]
    let tempConfig = {}

    const { ignoreData, ignoreParams } = _cache
    if (config.data) {
      tempConfig.data = sortAndfilterObject(
        /*
         * axios中data默认undefined，params默认不存在
         * data会默认被序列化成字符串
         */
        typeof config.data === 'string' ? JSON.parse(config.data) : config.data,
        ignoreData
      )
    }
    if (config.params) {
      tempConfig.params = sortAndfilterObject(config.params, ignoreParams)
    }
    tempConfig = {
      ...config,
      ...tempConfig
    }
    const configFlag = getConfigFlag(tempConfig)

    /* 如果存在缓存且未过期则直接输出缓存 */
    if (
      _cache.store[configFlag] &&
      !isOverTime(_cache.beginnig, _cache.timeout)
    ) {
      return new Promise((resolve, reject) => {
        _cache.store[configFlag].config = config
        resolve(_cache.store[configFlag])
      })
    }

    // 如果不存在缓存或者过期则重新请求，并且记入缓存初始时间
    tempConfig = {
      ...config,
      adapter: publicAxios.defaults.adapter
    }
    return publicAxios(tempConfig).then(data => {
      this.cache[urlFlag].beginnig = +new Date()
      this.cache[urlFlag].store[configFlag] = data
      return data
    })
  }

  pass = config => {
    const urlFlag = getUrlFlag(config)
    const _cache = this.cache[urlFlag]
    return !!_cache
  }
}

export default CacheAdapter
