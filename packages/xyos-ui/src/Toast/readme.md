## Toast

|props         | description              | 类型     |
|:-------------|:-------------------------|:---------|
|bottom         |  消息从底部弹出时，距离底部的位置，单位像素。| string|ReactNode|() => ReactNode
|className | 自定义 CSS class  | string
|duration | 默认 3 秒后自动关闭，配置为 null 则不自动关闭| number
|description | 通知提醒内容，必选 | string|ReactNode
|getContainer |	配置渲染节点的输出位置 | () => document.body
|content | 	 通知提醒标题  | string|ReactNode 
| onClose |  点击默认关闭按钮时触发的回调函数| Function
|onClick |点击通知时触发的回调函数  | Function
| placement | 弹出位置，可选 topLeft topRight bottomLeft bottomRight topCenter | string
|style|自定义内联样式 | 	React.CSSProperties
|top  | 消息从顶部弹出时，距离顶部的位置，单位像素 | number

------




