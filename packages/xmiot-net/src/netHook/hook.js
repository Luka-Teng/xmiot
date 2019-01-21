import check from './check'

check()

class Hook {
  handlers = []

  call = () => {
    throw new Error('call method should be overwritten')
  }

  listen = fn => {
    this.handlers.push(fn)
  }

  constructor (...args) {
    this.run = (...params) => {
      if (args.length !== params.length) {
        throw new Error('wrong params number')
      }
      return this.call(...params)
    }
  }
}

export default Hook
