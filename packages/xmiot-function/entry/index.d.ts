declare const _default: {
  /**
   * 获取 连接的 中参数
   * @param name 参数 key
   */
  getQueryString(name: string): string
  /**
   * 获取 hash 连接中参数值
   * @param name
   */
  getHashString(name: string): string
  /**
   * 随机生成 n 为数字默认 32
   *
   */
  generateRandom(n?: number): string
  /**
   * 日期转换
   * time   时间戳
   * char   表示 转换时间的格式
   * char ='-'  2018-11-23
   * char ='/'  2018/11/23
   */
  formatDate(time: string | number, char?: string): string
  /**
   * formatDate(new Date().getTime());//2017-05-12 10:05:44
   * formatDate(new Date().getTime(),'YY年MM月DD日');//2017年05月12日
   * formatDate(new Date().getTime(),'今天是YY/MM/DD hh:mm:ss');//今天是2017/05/12 10:07:45
   *
   * 完全可以自定义 格式
   */
  FormatDate(time: string | number, format?: string): string
  /**
   * 时长转换
   * 入参 是 数字，转换成 时分秒的格式
   *
   */
  formatDuration(timeValue?: number, withHour?: boolean): string
  /**
   *
   * @param {播放的次数} count
   * 播放数 转换
   */
  transPlayCount(count: number): string | number
  /**
   *节流函数
   */
  throttle(fn: any, delay: any): () => void
  /**
   *
   * @param target 监听 目标对象
   * @param type  类型 scroll
   * @param fn 方法 或者函数
   * @param capture
   */
  addEventHandle(target: any, type: any, fn: any, capture?: boolean): void
  /**
   *
   * @param {监听 目标对象} target
   * @param { 类型 scroll} type
   * @param fn 方法 或者函数
   * @param capture
   */
  removeEventHandle(target: any, type: any, fn: any, capture: boolean): void
  /**
   *
   * @param {要移动的距离} number
   * @param {时间} time
   * 滚动 ，入参是 滚动的距离 和时间
   */
  ScrollTop(number: number, time: any): number
  getFetchingLock(timeout: number): (callback: () => void) => Promise<void | {}>
  /**
   *
   * @param key 获取本地存储 key值
   */
  getData(key: string): any
  /**
   *
   * @param  key
   */
  removeData(key: string): void
  /**
   *
   * @param key 缓存 的key值
   * @param item 本地存储的 value
   */
  setData(key: string, item: any): void
  /**
   * 表单 提交验证
   *
   */
  isMobile(str: any): boolean
  isTel(str: any): boolean
  isIDCard1(str: any): boolean
  /**
   * 身份证号验证 18位
   */
  isIDCard2(str: any): boolean
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
  CharacterVerify(str: string, minnum: string, maxnum: string): boolean
}
export default _default
