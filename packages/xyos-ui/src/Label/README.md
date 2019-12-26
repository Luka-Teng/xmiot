## Label

|props| description                 |
|:----|:------------------|
|align | 垂直对齐方式，默认居中|
|label | 条目名称 |
|required| 是否必填（boolean）|
|style| 用于Label最外层元素样式扩展 |
|labelClassName| 用于类名扩展label名称样式 |
|content| Label右侧具体内容 |
|children| 通过插槽注入内容，会覆盖content |

----

> 使用示例：

```
 <Label
    align='center'
    label="labelName"
    required={true}
    style={{ fontSize: '14px', height: '100px', width: '400px', }}
    content={<h1>我是children</h1>}>
    <h2>我是children</h2>
  </Label>

```