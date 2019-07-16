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
  // 对data排序并反序列化
  if (data) {
    data = sortAndfilterObject(
      typeof data === 'string' ? JSON.parse(data) : data,
      []
    )
  }

  // 对params排序并反序列化
  if (params) {
    params = sortAndfilterObject(params, [])
  }

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
    method: method.toLocaleUpperCase()
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

/* 深复制 */
export const deepAssign = source => {
  // source如果是数组
  if (source instanceof Array) {
    return source.map(s => {
      return deepAssign(s)
    })
  }

  // source如果是对象
  if (Object.prototype.toString.call(source) === '[object Object]') {
    const temp = {}
    Object.keys(source).forEach(key => {
      temp[key] = deepAssign(source[key])
    })
    return temp
  }

  // source是一个普通的值
  return source
}
