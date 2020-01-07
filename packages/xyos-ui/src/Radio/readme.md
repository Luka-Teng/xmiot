
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
| options | 配置子元素 |
| value  | 设置当前选中的值|
|size| 'large' | 'default' | 'small' |
|options| 配置 array |


----

## Radio

|props| description       |
|:----|:------------------|
| checked  | 默认选中 |
|defaultChecked | 初始是否选中 |
|onChange | 触发多选的状态，可直接获取到 checkedValues 是选中之后的value 数组|
|disabled| 不可用的勾选 （boolean）|
|className| 用于类名扩展定义业务样式|
| value  | 根据 value 进行比较，判断是否选中 |
| onClick| 点击事件 |
| onChange| change事件 |


```

 	handleChange = (e: any) => {
		console.log(`selected ${e.target.value}`);
		this.setState({
			selectedValue: e.target.value
		});
	}

		<Radio.Group name="lei" value={this.state.selectedValue} onChange={this.handleChange}>
      <Radio value="111">选项一</Radio>
      <Radio value="222">选项二</Radio>
      <Radio value="333">选项三</Radio>
    </Radio.Group>


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

// 添加

  <Radio.Group options={optionsWithDisabled} onChange={this.onChange1} value={this.state.value3} />

  <Radio.Group radiobutton options={optionsWithDisabled} onChange={this.onChange1} value={this.state.value3} />



```


