import parse from 'url-parse'

/*
 * 顺序执行promise
 * handler可以是普通函数和promise
 * 整个sequence的状态是由handler返回值决定的
 * stop: 用于打断队列
 */
export const promiseSequence = (arr, handler) => {
  let sequence = Promise.resolve()
  let _stop = false
  const stop = () => {
    _stop = true
  }
  for (let i in arr) {
    sequence = sequence.then(() => handler(arr[i], stop))
    if (_stop) {
      break
    }
  }
  return sequence
}

export const getOriginWithPath = url => {
  const { origin, pathname } = parse(url)
  return origin + pathname
}
