## Select

|props| description              | 类型     |
|:----|:-------------------------|:---------|
|allowClear |  支持清除           | boolean
|defaultValue | 指定默认选中的条目  | string, string[] ,number ,number[] 
|disabled   | 禁用                | boolean
|disabled| 不可用的勾选 （boolean） |
|dropdownClassName| 下拉菜单的 className 属性 | string                |
|dropdownMatchSelectWidth| 下拉菜单和选择器同宽  |  boolean（默认），number 定义菜单的宽度
| dropdownStyle | 	下拉菜单的 style 属性  | object
|labelInValue | 是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 {key: string, label: ReactNode} 的格式 |  boolean  默认false
| mode   |  设置 Select 的模式为多选或标签 | string  ('multiple' | 'tags')
|  showArrow | 是否显示下拉小箭头  |  boolean 默认true
| size | 选择框的大小 | string （large small）
| onChange |  选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数 |  function
| onMouseEnter | 鼠标移入之后的 回调 | function
| onMouseLeave | 鼠标移出回调| function
|onPopupScroll | 下拉列表滚动时的回调| function
| open  |  	是否展开下拉菜单   | boolean 
|defaultOpen| 是否默认展开下拉菜单 | boolean
|onDropdownVisibleChange| 展开下拉菜单的回调 | function
| loading | 加载中的状态  | boolean 默认false

------



## Option 

|props| description              | 类型     |
|:----|:-------------------------|:---------|
|disabled  |  是否禁用           | boolean
|key | 和 value 含义一致。如果 React 需要你设置此项  | string
|title   | 禁用                | boolean
|value| 默认根据此属性值进行筛选 |
|className| 类名| string 


