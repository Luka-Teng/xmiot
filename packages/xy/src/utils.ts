/* 获取一个包含promise本体，res，rej的对象 */
const getPromise = () => {
  let res: any
  let rej: any
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })
  return { promise, res, rej }
}

const kickArray = (arr: any[], index: number) => {
  if (typeof index !== 'number' || index < 0 || index > arr.length - 1) {
    throw new Error('不能踢出不存在的index')
  }
  return [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)]
}

export { getPromise, kickArray }
