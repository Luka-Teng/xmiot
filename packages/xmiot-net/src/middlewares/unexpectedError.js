// 防止重复提交
export default net => {
  net.postError((error, stop) => {
    /**
     * 判断是否是err是否携带config来判断是否是请求前的程序错误，还是请求后网络错误。
     * 如果是请求前的程序错误则会打乱调用链，抛出错误，提醒开发者
     */
    if (!error.config) {
      console.error(
        '这是请求前的程序错误，会破坏后置调用链，建议先修复bug，再刷新页面'
      )
      throw error
    }
    return error
  })
}
