/* 获取一个包含promise本体，res，rej的对象 */
const getPromise = () => {
  let res, rej
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })
  return { promise,res,rej }
}

export {
  getPromise
}