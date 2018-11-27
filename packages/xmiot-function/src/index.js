export default {
  /**
   *
   * @param {参数 key }
   * 获取 连接的 中参数
   */
  getQueryString (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },

  /*
       *
       * @param {*} name
       * 回去hash 连接中参数值
       */

  getHashString (name) {
    const hashContent = decodeURI(window.location.hash.slice(2))
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const r = hashContent.slice(hashContent.indexOf('?') + 1).match(reg)
    console.log(r)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },

  /**
   * 随机生成 n 为数字默认 32
   *
   */
  generateRandom (n = 32) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz'
    let res = ''
    for (let i = 0; i < n; i += 1) {
      const id = Math.ceil(Math.random() * 35)
      res += chars[id]
    }
    return res
  },

  /**
   * 日期转换
   * time   时间戳
   * char   表示 转换时间的格式
   * char ='-'  2018-11-23
   * char ='/'  2018/11/23
   */

  formatDate (time, char = '-') {
    const date = new Date(time)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    return `${y}${char}${m.substring(
      m.length - 2,
      m.length
    )}${char}${d.substring(d.length - 2, d.length)}`
  },

  /**
   * formatDate(new Date().getTime());//2017-05-12 10:05:44
   * formatDate(new Date().getTime(),'YY年MM月DD日');//2017年05月12日
   * formatDate(new Date().getTime(),'今天是YY/MM/DD hh:mm:ss');//今天是2017/05/12 10:07:45
   *
   * 完全可以自定义 格式
   */
  FormatDate (time, format = 'YY-MM-DD hh:mm:ss') {
    let date = new Date(time)

    let year = date.getFullYear()

    let month = date.getMonth() + 1

    let day = date.getDate()

    let hour = date.getHours()

    let min = date.getMinutes()

    let sec = date.getSeconds()

    let preArr = Array.apply(null, Array(10)).map(function (elem, index) {
      return '0' + index
    }) /// /开个长度为10的数组 格式为 00 01 02 03

    let newTime = format
      .replace(/YY/g, year)
      .replace(/MM/g, preArr[month] || month)
      .replace(/DD/g, preArr[day] || day)
      .replace(/hh/g, preArr[hour] || hour)
      .replace(/mm/g, preArr[min] || min)
      .replace(/ss/g, preArr[sec] || sec)

    return newTime
  },

  /**
   * 时长转换
   * 入参 是 数字，转换成 时分秒的格式
   *
   */
  formatDuration (time = 0, withHour = false) {
    if (time === 86400) {
      return '24:00'
    }
    const seconds =
      parseInt(time % 60, 10) >= 10
        ? parseInt(time % 60, 10)
        : `0${parseInt(time % 60, 10)}`
    const minutes =
      parseInt((time / 60) % 60, 10) >= 10
        ? parseInt((time / 60) % 60, 10)
        : `0${parseInt((time / 60) % 60, 10)}`
    const hours = parseInt((time / 3600) % 24, 10)
    if (hours !== 0) {
      return `${hours}:${minutes}:${seconds}`
    }
    if (withHour) {
      return `00:${minutes}:${seconds}`
    }
    return `${minutes}:${seconds}`
  },

  /**
   *
   * @param {播放的次数} count
   * 播放数 转换
   */
  transPlayCount (count) {
    if (count > 100000000) {
      return `${(count / 100000000).toFixed(1)}亿`
    }
    if (count > 10000) {
      return `${(count / 10000).toFixed(1)}万`
    }
    return count
  },

  /**
   *节流函数
   */

  throttle (fn, delay) {
    var timer = null

    return function () {
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn()
      }, delay)
    }
  },
  /**
   *
   * @param {监听 目标对象} target
   * @param { 类型 scroll} type
   * @param { 方法 或者函数} fn
   * @param { 布尔} capture
   */

  addEventHandle (target, type, fn, capture) {
    if (target.addEventListener) {
      target.addEventListener(type, fn, false)
    } else if (target.attachEvent) {
      target.attachEvent('on', type, fn)
    } else {
      target['on' + type] = fn
    }
  },
  /**
   *
   * @param {监听 目标对象} target
   * @param { 类型 scroll} type
   * @param { 方法 或者函数} fn
   * @param { 布尔} capture
   */

  removeEventHandle (target, type, fn, capture) {
    if (target.addEventListener) {
      // 如果为true的话，进入
      target.removeEventListener(type, fn, capture)
    } else if (target.attachEvent) {
      // IE8以下版本
      target.detachEvent('on' + type, fn, capture)
    }
  },

  /**
   *
   * @param {要移动的距离} number
   * @param {时间} time
   * 滚动 ，入参是 滚动的距离 和时间
   */

  ScrollTop (number = 0, time) {
    if (!time) {
      document.body.scrollTop = document.documentElement.scrollTop = number
      return number
    }
    const spacingTime = 20 // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime // 计算循环的次数
    let nowTop = document.body.scrollTop + document.documentElement.scrollTop // 获取当前滚动条位置
    let everTop = (number - nowTop) / spacingInex // 计算每次滑动的距离

    let scrollTimer = setInterval(() => {
      if (spacingInex > 0) {
        spacingInex--
        this.ScrollTop((nowTop += everTop))
      } else {
        clearInterval(scrollTimer) // 清除计时器
      }
    }, spacingTime)
  },

  // 避免 重复的获取异步资源
  /*
      callback: 需要回调的异步请求，可以是async function，普通方法（返回常量，promise，不返回都可以）
      timeout: 超时时间，防止promise一直处于pending状态
    */
  getFetchingLock (timeout) {
    let lock = false

    const timeOutTrigger = time =>
      new Promise(resolve =>
        setTimeout(() => {
          resolve(undefined)
        }, time)
      )

    return async callback => {
      try {
        if (!lock) {
          lock = true
          const result = await Promise.race([
            callback(),
            timeOutTrigger(timeout)
          ])
          lock = false
          return result
        }
      } catch (e) {
        lock = false
        throw new Error(e)
      }
    }
  },

  /**
   *
   * @param {获取本地存储 key值} key
   */
  getData (key) {
    return JSON.parse(localStorage.getItem(key))
  },

  /**
   *
   * @param {缓存 的key值} key
   * @param {本地存储的 value} item
   */

  setData (key, item) {
    return localStorage.setItem(key, JSON.stringify(item))
  },

  /**
   * 表单 提交验证
   *
   */

  isMobile (str) {
    if (str == null || str === '') return false
    var result = str.match(
      /^((\(\d{2,3}\))|(\d{3}\-))?((13\d{9})|(15\d{9})|(18\d{9}))$/
    )
    if (result == null) return false
    return true
  },
  isPhone (str) {
    if (str == null || str === '') return false
    var result = str.match(
      /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/
    )
    if (result == null) return false
    return true
  }
}