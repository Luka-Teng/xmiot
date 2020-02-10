import { mount } from 'enzyme'
import React from 'react'
import { createForm } from '../index'

/**
 * 该测试用例主要测试
 * 
 * 在非Form集成下：
 * 1. 触发trigger事件，内部value情况
 * 
 * 在Form集成下：
 * 1. 未触发trigger事件，未设置初始值，外部value情况
 * 2. 未触发trigger事件，已设置初始值，外部value情况
 * 3. 触发trigger事件，外部value情况
 * 4. 非dirty状态下，改变初始值，外部value情况
 * 5. dirty情况下，改变初始值，外部value情况
 * 6. setFieldsValue，外部value情况
 * 7. resetFields，外部value情况
 * 8. 设置rules情况下，validateFields + getFieldErrors，获取errors情况
 */
describe('test for Input in Form', () => {
  let container
  let formWrapper
  let formRef
  let input

  const [Form, FormItem] = createForm()
  const Comp = (props = {}) => {
    return (
      <Form>
        <FormItem
          name="input"
          {...props}
        >
          <input id="input" />
        </FormItem>
      </Form>
    )
  }

  /* react组件的挂载 */
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    formWrapper = mount(
      <Comp />,
      { attachTo: container }
    )
    formRef = formWrapper.childAt(0).instance()
    input = formWrapper.find('#input')
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('未触发trigger事件，未设置初始值，外部value情况', () => {
    expect(formRef.getFieldValue('input')).toBe(undefined)
  })

  it('未触发trigger事件，已设置初始值，外部value情况', () => {
    formWrapper.setProps({initialValue: 'input'})
    expect(formRef.getFieldValue('input')).toBe('input')
  })

  it('触发trigger事件，外部value情况', () => {
    input.simulate('change', { target: { value: 'changed' } })
    expect(formRef.getFieldValue('input')).toBe('changed')
  })

  it('dirty情况下，改变初始值，外部value情况', () => {
    input.simulate('change', { target: { value: 'changed' } })
    formWrapper.setProps({initialValue: 'changed again'})
    expect(formRef.getFieldValue('input')).toBe('changed')
  })

  it('非dirty状态下，改变初始值，外部value情况', () => {
    // resetFieldsValue强制恢复为非dirty
    formRef.resetFieldsValue()
    formWrapper.setProps({initialValue: 'input'})
    expect(formRef.getFieldValue('input')).toBe('input')
  })

  it('setFieldsValue，外部value情况', () => {
    formRef.setFieldsValue({
      input: 'input'
    })
    expect(formRef.getFieldValue('input')).toBe('input')
  })

  it('resetFieldsValue，外部value情况', () => {
    // 先预设初始值
    formWrapper.setProps({initialValue: 'input'})

    // 模拟输入，使之为dirty
    input.simulate('change', { target: { value: 'changed' } })

    // 重置
    formRef.resetFieldsValue()
    expect(formRef.getFieldValue('input')).toBe('input')
  })

  it('设置rules情况下，validateFields + getFieldErrors，获取errors情况', () => {
    // 先预设初始值
    formWrapper.setProps({
      validates: [
        {
          pattern: /^aaa/,
          message: 'aaa'
        },
        {
          pattern: /^bbb/,
          message: 'bbb'
        }
      ]
    })

    // 模拟输入
    input.simulate('change', { target: { value: 'invalid' } })

    // 进行校验
    formRef.validateFields()
    expect(formRef.getFieldErrors('input')).toMatchObject(['aaa', 'bbb'])
  })
})