## Input


| 参数         | 说明                                     | 类型              | 默认值  |
| ------------ | ---------------------------------------- | ----------------- | ------- |
| addonAfter   | 带标签的 input，设置后置标签             | string\|ReactNode |         |
| addonBefore  | 带标签的 input，设置前置标签             | string\|ReactNode  |         |
| defaultValue | 输入框默认内容                           | string            |         |
| disabled     | 是否禁用状态，默认为 false               | boolean           | false   |
| prefix       | 带有前缀图标的 input                     | string\|ReactNode |         |
| size         | 控件大小。可选 `large` `default` `small` | string            | default |
| suffix       | 带有后缀图标的 input                     | string\|ReactNode |         |
| value        | 输入框内容                               | string            |         |
| onChange     | 输入框内容变化时的回调                   | function(e)       |         |
| onPressEnter | 按下回车的回调                           | function(e)       |         |
| allowClear   | 可以点击清除图标删除内容                 | boolean           | false   |