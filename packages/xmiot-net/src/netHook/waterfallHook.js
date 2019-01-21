import Hook from './hook'

/**
 * @description 瀑布式串联钩子
 * 创建实例：
 * hook = new WaterfallHook(args: any[])
 * **
 * 加入事件：
 * hook.listen((args: any, stop: Function) => {})
 * **
 * 触发事件流：
 * hook.run(args: any[])
 * **
 * 链接多个钩子, 几个钩子就添加几个事件，主钩子stop事件会导致所链接钩子的事件全部失效。
 * hook1.connect(hook2)(() => {
 * }, () => {
 * })
 * **
 */
class WaterfallHook extends Hook {
  connections = new Map()

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
        return true
      }
    })
  }

  readyHandlers = this.proxy([...this.handlers])

  resetReady = () => {
    this.readyHandlers = this.proxy([...this.handlers])
  }

  deleteReady = fn => {
    const { readyHandlers } = this
    delete readyHandlers[readyHandlers.findIndex(handler => handler === fn)]
  }

  listen = fn => {
    this.handlers.push(fn)
    this.readyHandlers.push(fn)
  }

  connect = (...hooks) => {
    return (...fns) => {
      const connectedHooks = []

      if (fns.length !== hooks.length + 1) {
        throw new Error('hooks and fns are not compatible')
      }

      for (let i in hooks) {
        connectedHooks.push({
          hook: hooks[i],
          fn: fns[i + 1]
        })
      }

      this.connections.set(fns[0], connectedHooks)
    }
  }

  call = async (...params) => {
    const readyHandlers = this.readyHandlers
    let result

    let _stop = false
    const stop = () => {
      _stop = true
    }

    for (let i in readyHandlers) {
      if (_stop) {
        delete readyHandlers[i]
      } else {
        if (result === undefined) {
          result = await readyHandlers[i](...params, stop)
        } else {
          const _result = await readyHandlers[i](result, stop)
          result = _result === undefined ? result : _result
        }
      }
    }

    this.resetReady()
    return result
  }
}

export default WaterfallHook
