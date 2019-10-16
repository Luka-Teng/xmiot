/* 节流函数 */
export const throttle = (cb: Function, delay: number) => {
  let key: any = null

  return () => {
    if (key === null) {
      key = setTimeout(() => {
        cb()
        key = null
      }, delay)
    }
  }
}