## checkbox

###CheckboxGroup

|props| description                 |
|:----|:------------------|
|options | label ， value， disabled 数组对象格式 如：[{label:'da',value:'da'}]
|onChange | 触发多选的状态，可直接获取到 checkedValues 是选中之后的value 数组|
|defaultValue | string[] 数组 |
|disabled| 不可用的勾选 （boolean）|
|style| 用于样式扩展 |
|className| 用于类名扩展定义业务样式|

----
> 使用示例：
```
  const options = [
      { label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange', disabled: true },
    ];

	onChange = (e: any,) => {
		console.log('checkedValues', e)

		this.setState({
			checkboxValue: e.target.value
		});
	}

  
  <CheckboxGroup options={options} defaultValue={['Apple']} onChange={this.onChange}/>

  // 整组不可勾选
   <CheckboxGroup options={options} defaultValue={['Apple']} disabled onChange={this.onChange}/>

 // 也可以组合使用，但是不推荐

  <CheckboxGroup  defaultValue={['2']} onChange={this.onChange} style={{marginBottom:'20px'}}>
      <Checkbox value='A' disabled={true}>Checkbox</Checkbox>
      <Checkbox value='B'  >Checkbox</Checkbox>
      <Checkbox value='2' >Checkbox</Checkbox>
  </CheckboxGroup>     
```

### Checkbox

> Checkbox 组件的 child 必须写，就是选项的label

|props| description                 |
|:----|:------------------|
|value| value ， string
|onChange | 触发多选的状态，可直接获取到 checkedValues 是选中之后的value 数组|
|defaultValue | boolean |
|disabled| 不可用的勾选 （boolean）|
|style| 用于样式扩展 |
|className| 用于类名扩展定义业务样式|

----

> 使用示例：

```
 onChange = (e: any) => {
    console.log('checkedValues', e.target.checked)  // 结果 true or false
  }
  
  <Checkbox onChange={this.onChange} defaultChecked>Checkbox</Checkbox>

```