### 使用介绍

###### Form

封装表单和store交互的数据逻辑

###### FormItem

创建field，绑定事件, 处理props逻辑

###### WrappedElement

实现onChange接口，并传递value

```javascript
// xyos-ui的实现方式
const [Form, FormItem] = createForm()

<Form ref={this.ref}>
  <FormItem
    name="required"
    rules="not required"
    initialValue="not required"
    trigger="not required"
    valuePropName="not required"
  >
    <div>
      <WrappedElement />
    </div>
  </FormItem>
</Form>

// rc的实现方式
const Component = (props) => {
  const form = props.form
  const { getFieldDecorator } = form

  return getFieldDecorator({
    name:"",
    rules:"",
    initialValue:""
  })(component)
}

creatForm(options)(Component)
```