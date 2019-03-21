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
 * **
 * 链接多个hooks, hooks数目要和事件对应，hook1的stop事件会导致所链接hooks的事件全部失效。
 * hook1.connect(...hooks)(...cbs)
 * **
 */
class WaterfallHook extends Hook {
  /* 存储hooks间的事件关联 */
  connections = new Map()

  /**
   * proxy监听readyHandlers的delete事件
   * 达到不同hooks内部事件的同步删除
   */
  proxy = obj => {
    return new Proxy(obj, {
      deleteProperty: (target, prop) => {
        const { connections } = this
        const current = target[prop]
        if (connections.has(current)) {
          const connectedHooks = connections.get(current)
          for (let i in connectedHooks) {
            const { hook, fn } = connectedHooks[i]
            hook.deleteReady(fn)
          }
        }
        Reflect.deleteProperty(target, prop)
        return true
      }
    })
  }

  /* 实际进入运行队列的事件 */
  readyHandlers = this.proxy([...this.handlers])

  resetReady = () => {
    this.readyHandlers = this.proxy([...this.handlers])
  }

  deleteReady = fn => {
    const { readyHandlers } = this
    Reflect.deleteProperty(
      readyHandlers,
      readyHandlers.findIndex(handler => handler === fn)
    )
  }

  listen = fn => {
    this.handlers.push(fn)
    this.readyHandlers.push(fn)
  }

  /* 关联不同hooks之间的事件 */
  connect = (...hooks) => (...fns) => {
    const connectedHooks = []

    if (fns.length !== hooks.length + 1) {
      throw new Error('hooks and fns are not compatible')
    }

    this.listen(fns[0])

    for (let i in hooks) {
      connectedHooks.push({
        hook: hooks[i],
        fn: fns[+i + 1]
      })
      hooks[i].listen(fns[+i + 1])
    }

    this.connections.set(fns[0], connectedHooks)
  }

  /* 运行方法，会被父类hook的run调用 */
  call = async (...params) => {
    const readyHandlers = this.readyHandlers
    params = params.length === 0 ? [undefined] : params

    let result, err
    let _stop = false
    const stop = () => {
      _stop = true
    }

    for (let i in readyHandlers) {
      if (_stop) {
        /* 如果产生中断，则删除相应事件，并通过proxy删除关联事件 */
        delete readyHandlers[i]
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

    this.resetReady()
    if (err) throw err
    return result === undefined ? params[0] : result
  }
}

export default WaterfallHook
