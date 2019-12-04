### 使用介绍

ts的overload可以用交叉类型来定义

#### Form

封装表单和store交互的数据逻辑

|props|description|
|:----|:----------|
|null|null|
---

#### FormItem

创建field，绑定事件, 处理props逻辑

|props|description|
|:----|:----------|
|name|field的name，必须|
|initialValue|初始值|
|validates|校验|
|valuePropName|绑定的子元素value名，默认value|
|trigger|绑定的子元素事件触发名，默认onChange|
|errorComponent|展示错误的组件|
---

#### WrappedElement

各自组件自己实现

注意：onChange接口，value的拦截

FormItem默认是对value分发，对onChange事件进行拦截，所以各自的wrappedElement需要实现的是：

1. 一般情况下WrappedElement需要实现两个对外暴露的属性，value + onChange，value是可以通过外界值，是内部表单组件成为受控组件，onChange是对内部表单组件的事件监听。

2. 如果外界不传props.value，则内部管理自己的状态值，建议以state来管理。如果外界传props.value则将其直接托管于外部
---

#### 使用方式

```javascript
// xyos-ui的实现方式
const [Form, FormItem] = createForm()

<Form ref={this.ref}>
  <FormItem
    name="required"
    validates="not required"
    initialValue="not required"
    trigger="not required"
    valuePropName="not required"
  >
    <WrappedElement />
  </FormItem>
</Form>

// rc的实现方式
const Component = (props) => {
  const form = props.form
  const { getFieldDecorator } = form

  return getFieldDecorator({
    name: "required"
    rules: "not required"
    initialValue: "not required"
    trigger: "not required"
    valuePropName: "not required"
  })(WrappedElement)
}

creatForm(options)(Component)
```