import { version as pkgVersion, name as pkgName } from '../package.json'

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

/* 剔除array中的某一个元素 */
const kickArray = (arr: any[], index: number) => {
  if (typeof index !== 'number' || index < 0 || index > arr.length - 1) {
    throw new Error('不能踢出不存在的index')
  }
  return [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)]
}

/* 显示版本信息 */
const checkVersion = () =>
  console.warn(`You are using ${pkgName} v${pkgVersion}`)

export { getPromise, kickArray, checkVersion }
