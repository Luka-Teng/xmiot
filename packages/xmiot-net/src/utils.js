/*
 * 顺序执行promise
 * handler可以是普通函数和promise
 * 整个sequence的状态是由handler返回值决定的
 * stop: 用于打断队列
 * passedData表示上一个handler的返回值
 */
export const promiseSequence = (arr, handler) => {
  let sequence = Promise.resolve()
  let _stop = false
  const stop = () => {
    _stop = true
  }

  for (let i in arr) {
    sequence = sequence.then(passedData => {
      if (!_stop) {
        if (passedData) {
          // 每次进来都要重置notAErrorInError，表示在postError回调中不抛出错误
          passedData.notAErrorInError = false
          return handler(arr[i], stop, passedData)
        }
        return handler(arr[i], stop)
      } else {
        return passedData
      }
    })
  }
  return sequence
}

/*
 * 用于判断是否过期
 */
export const isOverTime = (beginning, timeout) => {
  const now = +new Date()
  if (now - beginning > timeout) {
    return true
  }
  return false
}

/*
 * 用于返回configFlag
 */
export const getConfigFlag = ({ baseURL, url, method, params, data }) => {
  if (baseURL) {
    url = url.indexOf(baseURL) === 0 ? url : handlePath(baseURL).join(url).url
  }
  return JSON.stringify({
    url,
    method,
    params,
    data
  })
}

/*
 * 用于返回urlFlag
 */
export const getUrlFlag = ({ baseURL, url, method }) => {
  if (baseURL) {
    url = url.indexOf(baseURL) === 0 ? url : handlePath(baseURL).join(url).url
  }
  return JSON.stringify({
    url,
    method
  })
}

/*
 * 串接地址
 */
export const handlePath = (base = '') => {
  let obj = {}

  const join = (path = '') => {
    const { url } = obj
    obj.url = url.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
    return obj
  }

  const addParam = (paramName, value) => {
    if (paramName === undefined || value === undefined) {
      return obj
    }
    const { url } = obj
    if (/\?/g.test(url)) {
      obj.url += `&${paramName}=${value}`
    } else {
      obj.url += `?${paramName}=${value}`
    }
    return obj
  }

  return (obj = {
    join,
    addParam,
    url: base
  })
}

/* 过滤对象的属性 */
export const sortAndfilterObject = (data, ignore) => {
  if (Object.prototype.toString.call(data) !== '[object Object]') return data

  let isNullObject = true

  const result = Object.keys(data)
    .sort()
    .reduce((a, b) => {
      if (!ignore.includes(b)) {
        a[b] = data[b]
        isNullObject = false
      }
      return a
    }, {})

  return isNullObject ? undefined : result
}

/* 获取一个包含promise本体，res，rej的对象 */
export const getPromise = () => {
  let res, rej
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })
  return { promise, res, rej }
}
