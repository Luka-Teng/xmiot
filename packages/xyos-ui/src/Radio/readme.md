
## RadioGroup

|props| description                 |
|:----|:------------------|
|defaultValue | radio 默认选中的值
|onChange | 触发多选的状态，可直接获取到 checkedValues 是选中之后的value 数组|
|disabled| 不可用的勾选 （boolean）|
|radiobutton| 修改成 button 样式 |
|className| 用于类名扩展定义业务样式|
|style| 用于样式扩展|
| className| 用于类名扩展 |

----


```

  handleChange = (checkValue: any) => {
    console.log('value-', checkValue)
    this.setState({
      selectedValue: checkValue
    });
  }

<RadioGroup name="platform" defaultValue={this.state.selectedValue} onChange={this.handleChange}>
    <Radio value="PC" disabled={true}>选项一</Radio>
    <Radio value="APP">选项二</Radio>
    <Radio value="WAP">选项三</Radio>
</RadioGroup>


// 添加参数radiobutton 使用 button 样式展示

<RadioGroup name="platform" radiobutton defaultValue={this.state.selectedValue} onChange={this.handleChange}>
    <Radio value="PC" >选项一</Radio>
    <Radio value="APP" disabled={true}>选项二</Radio>
    <Radio value="WAP">选项三</Radio>
  </RadioGroup>


// 添加 disabled 整组radio 不可勾选状态

<RadioGroup name="platform" className='uuuuu' style={{color:'#333'}} disabled defaultValue={this.state.selectedValue} onChange={this.handleChange}>
  <Radio value="PC" >选项一</Radio>
  <Radio value="APP">选项二</Radio>
  <Radio value="WAP">选项三</Radio>
</RadioGroup>


```


