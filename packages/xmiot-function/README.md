### xmiot-function 包使用说明

 * getQueryString(name) 
   >  获取连接中参数
 * getHashString(name) 
   > 获取 hash 连接中参数
 * generateRandom(n) 
   > 获取n为 随机数 默认值32
 * formatDate(time, char = '-') 
   > time 时间戳戳 char 时间 连接-或者/
 * FormatDate(time, format = 'YY-MM-DD hh:mm:ss')
   > time 时间戳 
    第二个参数  时间格式 可以自定义
    比如 ：formatDate(new Date().getTime(),'今天是YY/MM/DD hh:mm:ss');
    //今天是2017/05/12 10:07:45

 * formatDuration(time)
   > 播放时长转换

 * transPlayCount（count）

   > 播放数量 转换

 *   throttle  (fn, delay)  节流函数
  
 * addEventHandle(target, type, fn, capture) 
   > 添加 监听 函数 
     target 针对的 目标对象
     type 类型 比如 scroll
     fn  方法
     capture 布尔

  * removeEventHandle (target, type, fn, capture)

    > 移出监听事件

  * ScrollTop(number = 0, time)
    > number  移动的距离
     time 需要的时间

  * getFetchingLock(timeout) // 避免重复获取异步资源

  * getData(key)  // 获取本地存储

  * setData (key, item) // 设置 本地存储



     




