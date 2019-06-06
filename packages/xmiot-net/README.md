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

2. Hook

xmiot-net的事件流机制参考tapable的Hook事件机制，事件支持异步和同步

waterfallHook：

```
const hook = new WaterfallHook('name')

hook.listen((name, stop) => { console.log(name) })

hook.listen(async (name, stop) => {
    console.log(name + 'test')
    stop()
    return name + 'test'
})

hook.listen((name) => {console.log('can not be printed')})

hook.run('luka')

print: luka lukatest
```

3. 拦截

```
拦截队列：
1. pre队列：请求发起前的拦截队列
2. postSuccess：响应成功的拦截队列
3. postError：响应失败的拦截队列

/*
 * 请求拦截层
 * config: axios配置信息
 * stop: 跳出链式调用，使用会取消后面的pre回调，以及和与该事件绑定的post回调
 * 返回的config会传递给下一个事件，如果返回undefined，则返回之前的传递值
 */ 
net.pre((config, stop) => {
  // your code here
  return config
})

/*
 * 成功响应拦截层
 * response: axios响应信息
 * stop: 跳出链式调用，使用会取消后面postSuccess的回调
 * 返回的response会传递给下一个事件，如果返回undefined，则返回之前的传递值
 */ 
net.postSuccess((response, stop) => {
  // your code here
  return response
})

/*
 * 失败响应拦截层
 * err: axios错误信息
 * stop: 跳出链式调用，使用会取消后面postError的回调
 * 返回的err会传递给下一个事件，如果返回undefined，则返回之前的传递值
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
 * url: string 要缓存的地址
 * method: fuction 方法
 * timeout: number 过期时间,
 * ignoreParams: string[] 无视的参数,
 * ignoreData: string[] 无视的payload
 */
net.onCache({url, method, timeout, ignoreParams, ignoreData})
```

4. 请求重发配置

如果需要对某个接口的失败做重发，可以使用重发配置
```
/*
 * url: 要重发的地址
 * method: 方法
 * times: 如果失败需要尝试几次
 */
 net.onResend({url, method, times})
```

5. mock

对接口进行mock
```
/*
 * 初始化baseURLs
 * baseURLs: 请求地址的base地址，一般填写axios中base即可
 */
 net.mockBase(...baseURLs)

/*
 * mock请求get
 * url: 要请求的url，是baseURL的相对地址
 * body: 包含的参数，一般是data或者params
 * code: 状态码
 * response: 响应
 * options.delay: 延迟
 * options.errorMessage: 错误信息
 */
net.get(url, body).reply(code, response, options)

/*
 * 单次mock请求get
 */
net.get(url, body).replyOnce(code, response, options)

/*
 * 其他mock请求
 */
net.post
net.put
net.delete

/*
 * mock的链式调用
 */
net.get('/a').replyOnce(200, {}, {delay: 3000})
  .get('/a').reply(400, {}, {errorMessage: 'error'})
```

###注意事项
不要再拦截器中返回非config/response/err的其他值，会产生不可控影响