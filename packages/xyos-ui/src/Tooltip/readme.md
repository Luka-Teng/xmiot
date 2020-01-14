## Tooltip

|props         | description              | 类型     |
|:-------------|:-------------------------|:---------|
|title         |  提示文字                | string|ReactNode|() => ReactNode
|arrowPointAtCenter | 箭头是否指向目标元素中心   | boolean (false)
|autoAdjustOverflow | 气泡被遮盖住 自动调整位置 | boolean （true）
|defaultVisible | 是否默认隐藏 | boolean（false）
|getPopupContainer |	浮层渲染父节点，默认渲染到 body 上 |Function(triggerNode)
|mouseEnterDelay | 	鼠标移入后延时多少才显示 Tooltip，单位：秒 |number
| mouseLeaveDelay | 鼠标移出后延时多少才隐藏 Tooltip，单位：秒 | number
|overlayClassName |卡片类名 | string
|overlayStyle | 卡片样式 | object
| placement | 气泡框位置，可选 top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom | string
|trigger  |触发行为，可选 hover/focus/click/ | string
|visible  | 用于手动控制浮层 | boolean
| onVisibleChange | 显示隐藏的回调 | 	(visible) => void
|title         |  卡片内容                | string|ReactNode|() => ReactNode
------




