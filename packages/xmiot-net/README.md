### xmiot-net

#### 安装

```
 npm i --save xmiot-net
```

#### 用法

1. 引入

```
import axios from 'axios'
import Net from 'xmiot-net'
const axiosInstance = axios.create()

/*
* 第一个参数为axios实例
* 第二个参数为布尔值，表示是否可以重复相同请求
*/
const net = new Net(axiosInstance, true)
```

2. 拦截

```
/*
 * 请求拦截
 * config: axios配置信息
 * stop: 跳出链式调用，使用会取消后面的回调
 * 必须返回config
 */ 
net.pre((config, stop) => {
  // your code here
  return config
})

/*
 * 成功响应拦截
 * response: axios响应信息
 * stop: 跳出链式调用，使用会取消后面的回调
 * 必须返回response
 */ 
net.postSuccess((response, stop) => {
  // your code here
  return response
})

/*
 * 失败响应拦截
 * err: axios错误信息
 * err.notAErrorInError 表示这不是一个错误，会被后面的覆盖
 * stop: 跳出链式调用，使用会取消后面的回调
 * 必须返回err
 */ 
net.postError((err, stop) => {
  // your code here
  return err
})

/*
 * 注意
 * 拦截支持链式调用
 */
net.pre().postSuccess().postError()
```

3. 缓存

```
/*
 * 缓存
 * url: 要缓存的地址
 * method: 方法
 * timeout: 过期时间
 */
net.onCache({url, method, timeout})
```

4. config
config参数挂在新的参数和方法。
* config.resend(): 对当前请求进行重发。
* err.statusText = 'cancel': 表示重复请求被取消。