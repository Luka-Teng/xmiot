/* 瀑布流式的执行promise */
exports.series = (loaders, ...params) => {
  const run = (loaders, ...params) => {
    /* 如果运行完，返回第一个参数 */
    if (loaders.length <= 0) return params[0]

    const loader = loaders.shift()
    return loader(...params).then(data => {
      return run(loaders, data)
    })
  }

  return run(loaders, ...params)
}

/* 判断types */
exports.is = (input, matchTypes, errorMessage) => {
  const types = {
    object: '[object Object]',
    array: '[object Array]',
    function: '[object Function]',
    string: '[object String]',
    number: '[object Number]',
    regExp: '[object RegExp]',
    undefined: '[object Undefined]'
  }

  const inputType = Object.prototype.toString.call(input)
  const typeForMatchTypes = Object.prototype.toString.call(matchTypes)

  const match = (inputType, type) => {
    if (types[type] && types[type] === inputType) return true
    return false
  }

  if (typeForMatchTypes === types.string) {
    if (match(inputType, matchTypes)) return true
  }

  if (typeForMatchTypes === types.array) {
    for (let i in matchTypes) {
      if (match(inputType, matchTypes[i])) return true
    }
  }

  throw new Error(errorMessage)
}
