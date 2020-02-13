import { mount } from 'enzyme'
import React from 'react'
import { createForm } from '../index'
import Radio from '../../Radio'

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
 * 9. 设置rules情况下，validateTrigger + getFieldErrors在事件触发时，获取errors情况
 */
describe('test for radio in Form', () => {
  let container
  let formWrapper
  let formRef
  let radio

  const [Form, FormItem] = createForm()
  const onChange = jest.fn()
  const Comp = (props = {}) => {
    return (
      <Form>
        <FormItem name="radio" {...props}>
          <Radio.Group name="platform" onChange={onChange}>
            <Radio value="1">选项一</Radio>
            <Radio value="2">选项二</Radio>
            <Radio value="3">选项三</Radio>
          </Radio.Group>
        </FormItem>
      </Form>
    )
  }

  /* react组件的挂载 */
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    formWrapper = mount(<Comp />, { attachTo: container })
    formRef = formWrapper.childAt(0).instance()
    radio = formWrapper.find(Radio)
    console.log(radio, 'radio', formWrapper)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('未触发trigger事件，未设置初始值，外部value情况', () => {
    expect(formRef.getFieldValue('radio')).toBe(undefined)
  })

  it('未触发trigger事件，已设置初始值，外部value情况', () => {
    formWrapper.setProps({ initialValue: '1' })
    expect(formRef.getFieldValue('radio')).toBe('1')
  })

  it('触发trigger事件，外部value情况', () => {
    // radio.simulate('change', { target: '1' })
    console.log(radio.find('.rc-radio'), '999')
    radio.at(3).simulate('change')
    expect(formRef.getFieldValue('radio')).toBe('3')
  })

  it('dirty情况下，改变初始值，外部value情况', () => {
    // radio.simulate('change', { target: '1' })
    radio
      .find('.rc-radio')
      .at(0)
      .simulate('change')
    formWrapper.setProps({ initialValue: '2' })
    expect(formRef.getFieldValue('radio')).toBe('1')
  })

  it('非dirty状态下，改变初始值，外部value情况', () => {
    // resetFieldsValue强制恢复为非dirty
    formRef.resetFieldsValue()
    formWrapper.setProps({ initialValue: '2' })
    expect(formRef.getFieldValue('radio')).toBe('2')
  })

  it('setFieldsValue，外部value情况', () => {
    formRef.setFieldsValue({
      radio: '2'
    })
    expect(formRef.getFieldValue('radio')).toBe('2')
  })

  // it('resetFieldsValue，外部value情况', () => {
  //   // 先预设初始值
  //   formWrapper.setProps({ initialValue: '1' })

  //   // 模拟输入，使之为dirty
  //   radio.simulate('change', { target: { value: 'changed' } })

  //   // 重置
  //   formRef.resetFieldsValue()
  //   expect(formRef.getFieldValue('radio')).toBe('1')
  // })

  it('设置rules情况下，validateFields + getFieldErrors，获取errors情况', () => {
    // 先预设初始值
    formWrapper.setProps({ initialValue: '1' })

    // 模拟输入
    radio.simulate('change', { target: { value: '2' } })

    // 进行校验
    formRef.validateFields()
    expect(formRef.getFieldErrors('radio')).toMatchObject(['1'])
  })

  it('设置rules情况下，validateTrigger + getFieldErrors在事件触发时，获取errors情况', () => {
    // 先预设初始值
    formWrapper.setProps({ initialValue: '1' })

    // 模拟输入，validateTrigger没有设置，不会产生errors
    radio.simulate('change', { target: { value: '2' } })
    expect(formRef.getFieldErrors('radio')).toMatchObject([])

    // 模拟输入，validateTrigger进行设置，会产生errors
    formWrapper.setProps({
      validateTrigger: 'onChange'
    })
    radio.simulate('change', { target: { value: '1' } })
    expect(formRef.getFieldErrors('radio')).toMatchObject(['1'])
  })
})
