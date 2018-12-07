### xmiot-record 包使用说明
此包是录音组件的高阶函数
* 第一个参数(component)为react组件
* 第二参数是(autoStop)控制是否要自动关闭录音（boolean）true为自动关闭，false手动结束

#### 属性
getData：录音结束的回调函数，自动传入录音数据
#### props
通过此高阶组件的包装，react组件会获得三个方法（startRecording， stopRecording），和一个属性（isRecording）
* startRecording：调用开始录音
* stopRecording：在autoStop为false的情况下可通过调用此方法手动关闭录音
* onFinished：参数为一个回调函数，自动传入录音数据
* isRecording：当前的录音状态，true为正在录音，false为录音结束
> 目前导出的mimeType为audio/wav