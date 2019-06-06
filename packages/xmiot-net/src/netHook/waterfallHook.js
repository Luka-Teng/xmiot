import Hook from './hook'

/**
 * @description 瀑布式串联hook
 * @description 每个事件的返回都会带给下一个做参数，如果不返回则默认返回上一个
 * 创建实例：
 * hook = new WaterfallHook(args: any[])
 * **
 * 加入事件：
 * hook.listen(cb: (args: any[], stop: Function) => any)
 * **
 * 触发事件流：
 * hook.run(args: any[])
 */
class WaterfallHook extends Hook {
  listen = fn => {
    if (this.handlers.indexOf(fn) === -1) {
      this.handlers.push(fn)
    }
  }

  /* 运行方法，会被父类hook的run调用 */
  call = async (...params) => {
    const readyHandlers = [...this.handlers]
    params = params.length === 0 ? [undefined] : params

    let result, err
    let _stop = false
    const stop = () => {
      _stop = true
    }

    for (let i in readyHandlers) {
      if (_stop) {
        break
      } else {
        let _result
        try {
          result === undefined
            ? (_result = await readyHandlers[i](...params, stop))
            : (_result = await readyHandlers[i](
              result,
              ...params.slice(1),
              stop
            ))
        } catch (e) {
          stop()
          err = e
        }
        /* 保证返回值可以断崖式（遇到事件没有返回值）传递 */
        result = _result === undefined ? result : _result
      }
    }

    if (err) throw err
    return result === undefined ? params[0] : result
  }
}

export default WaterfallHook
