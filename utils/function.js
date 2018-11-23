const isObject = source => {
  return Object.prototype.toString.call(source) === '[object Object]'
}

const isArray = source => {
  return Object.prototype.toString.call(source) === '[object Array]'
}

const deepAssign = (target = {}, source) => {
  if (!isObject(source) && !isArray(source)) {
    throw new Error('源参数必须为对象或者数组')
  }
  Object.keys(source).forEach(key => {
    if (isArray(source[key])) {
      isArray(target[key]) ? (() => {})() : (target[key] = [])
      deepAssign(target[key], source[key])
    } else if (isObject(source[key])) {
      isObject(target[key]) ? (() => {})() : (target[key] = {})
      deepAssign(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  })
  return target
}

const multiDeepAssign = (target = {}, ...source) => {
  const arr = [...source.reverse(), target]
  arr.forEach(e => {
    if (!isObject(e)) {
      throw new Error('源参数必须为对象')
    }
  })
  return arr.reduce((a, b) => {
    return deepAssign(b, a)
  })
}

// 异步方法遍历，每个方法有next交替权
const eachWithNext = (items, handler, complete) => {
  let i = 0
  const next = () => {
    const item = items[i++]
    if (!item) {
      if (complete && typeof complete === 'function') complete()
      return
    }
    handler(item, next)
  }
  next()
}

// 异步方法遍历，所有方法以Promise.all执行
const eachWithAll = (items, handler, complete) => {
  let queues = []
  items.forEach(item => {
    queues.push(
      new Promise((resolve, reject) => {
        handler(item, resolve, reject)
      })
    )
  })
  Promise.all(queues).then(() => {
    if (complete && typeof complete === 'function') complete()
  })
}

module.exports = {
  isArray,
  isObject,
  eachWithAll,
  eachWithNext,
  multiDeepAssign
}
