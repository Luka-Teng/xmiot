/** 将数字格式化为两位以上，不满 10 在前面添加 0 */
function fixDigit(num: number) {
  return num < 10 ? '0' + num : num
}

export default {
  /**
   * 获取 连接的 中参数
   * @param name 参数 key
   */
  getQueryString(name: string) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  },

  /**
   * 获取 hash 连接中参数值
   * @param name
   */
  getHashString(name: string) {
    const hashContent = decodeURI(window.location.hash.slice(2))
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const r = hashContent.slice(hashContent.indexOf('?') + 1).match(reg)

    if (r != null) {
      return unescape(r[2])
    }
    return null
  },

  /**
   * 随机生成 n 为数字默认 32
   *
   */
  generateRandom(n = 32) {
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
  formatDate(time: number | string, char = '-') {
    const date = new Date(time)
    const y = date.getFullYear()
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
  FormatDate(time: number, format = 'YY-MM-DD hh:mm:ss') {
    console.log(time)
    let date = new Date(time)

    let year = date.getFullYear()

    let month = date.getMonth() + 1

    let day = date.getDate()

    let hour = date.getHours()

    let min = date.getMinutes()

    let sec = date.getSeconds()

    let preArr = Array.apply(null, Array(10)).map(function(
      elem: any,
      index: number
    ) {
      return '0' + index
    }) /// /开个长度为10的数组 格式为 00 01 02 03

    let newTime = format
      .replace(/YY/g, (year as {}) as string)
      .replace(/MM/g, (preArr[month] || month) as string)
      .replace(/DD/g, (preArr[day] || day) as string)
      .replace(/hh/g, (preArr[hour] || hour) as string)
      .replace(/mm/g, (preArr[min] || min) as string)
      .replace(/ss/g, (preArr[sec] || sec) as string)

    return newTime
  },

  /**
   * 时长转换
   * 入参 是 数字，转换成 时分秒的格式
   *
   */
  formatDuration(timeValue = 0, withHour = false) {
    if (timeValue === 86400) {
      return '24:00'
    }

    const time: number =
      typeof timeValue === 'string'
        ? parseInt((timeValue as {}) as string, 10)
        : timeValue

    const seconds = fixDigit(time % 60)
    const minutes = fixDigit(Math.floor(time / 60) % 60)
    const hours = Math.floor(time / 3600) % 24

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
  transPlayCount(count: number) {
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

  throttle(fn: Function, delay: number) {
    let timer: any = null

    return function() {
      clearTimeout(timer)
      timer = setTimeout(function() {
        fn()
      }, delay)
    }
  },
  /**
   *
   * @param target 监听 目标对象
   * @param type  类型 scroll
   * @param fn 方法 或者函数
   * @param capture
   */
  addEventHandle(
    target: any,
    type: string,
    fn: Function,
    capture: boolean = false
  ) {
    if (target.addEventListener) {
      target.addEventListener(type, fn, capture)
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
   * @param fn 方法 或者函数
   * @param capture
   */
  removeEventHandle(target: any, type: string, fn: Function, capture: boolean) {
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

  ScrollTop(number = 0, time?: number) {
    if (!time) {
      document.body.scrollTop = (document.documentElement as HTMLElement).scrollTop = number
      return number
    }
    const spacingTime = 20 // 设置循环的间隔时间  值越小消耗性能越高
    let spacingInex = time / spacingTime // 计算循环的次数
    let nowTop =
      document.body.scrollTop +
      (document.documentElement as HTMLElement).scrollTop // 获取当前滚动条位置
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
  getFetchingLock(timeout: number) {
    let lock = false

    const timeOutTrigger = (time: number) =>
      new Promise(resolve => {
        setTimeout(() => resolve(undefined), time)
      })

    return async (callback: () => void) => {
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
   * @param key 获取本地存储 key值
   */
  // getData(key: string) {
  //   let value:string=JSON.parse(localStorage.getItem(key))
  //   return
  // },

  getData(key: string) {
    let value = localStorage.getItem(key)
    if (value && value != 'undefined' && value != 'null') {
      return JSON.parse(value)
    }
    return null
  },

  /**
   *
   * @param  key
   */
  removeData(key: string) {
    localStorage.removeItem(key)
  },

  /**
   *
   * @param key 缓存 的key值
   * @param item 本地存储的 value
   */

  setData(key: string, item: any) {
    return localStorage.setItem(key, JSON.stringify(item))
  },

  /**
   * 表单 提交验证
   *
   */

  // 手机 验证 11为手机号
  isMobile(str: string) {
    if (str == null || str === '') return false
    var result = str.match(/0?(13|14|15|18|17)[0-9]{9}/)
    if (result == null) return false
    return true
  },

  // 验证 固定电话
  isTel(str: string) {
    if (str == null || str === '') return false
    var result = str.match(/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/)
    if (result == null) return false
    return true
  },

  // 身份证号 验证 15位

  isIDCard1(str: string) {
    if (str == null || str === '') return false
    var result = str.match(
      /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/
    )
    if (result == null) return false
    return true
  },

  /**
   * 身份证号验证 18位
   */

  isIDCard2(str: string) {
    if (str == null || str === '') return false
    var result = str.match(
      /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/
    )
    if (result == null) return false
    return true
  },

  /**
   *
   * @param str  输入 字符
   * @param minnum  输入字符的最小位数
   * @param maxnum  输入字符的最大位数
   *
   * 不能纯数字 ，不能纯字符串，不能纯特殊字符
   *
   * 如果 maxnum 为0 则是选择不显示 字符 长度的限制
   *
   */

  CharacterVerify(str: string, minnum: string, maxnum: string) {
    let reg = ''
    if (str === null || str === '') return false
    if (!maxnum) {
      reg = '/^(?![d]+$)(?![a-zA-Z]+$)(?![^da-zA-Z]+$)/'
    } else {
      reg =
        '/^(?![d]+$)(?![a-zA-Z]+$)(?![^da-zA-Z]+$).{' +
        minnum +
        ',' +
        maxnum +
        '}$/'
    }
    let result = str.match(eval(reg))
    if (result === null) return false
    return true
  }
}
