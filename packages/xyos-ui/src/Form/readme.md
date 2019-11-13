### 使用介绍

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
---

#### WrappedElement

各自组件自己实现

注意：onChange接口，value的拦截

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