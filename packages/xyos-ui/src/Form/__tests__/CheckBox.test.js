import { mount } from 'enzyme'
import React from 'react'
import RcCheckbox from 'rc-checkbox'
import { createForm } from '../index'
import Radio from '../../Radio'
import {CheckboxGroup,Checkbox} from '../../Checkbox'
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
  let checkBoxGroup

  const [Form, FormItem] = createForm()
  const onChange = jest.fn()
  const Comp = (props = {}) => {
    return (
      <Form>
        <FormItem name="checkbox" {...props}>
        <CheckboxGroup  onChange={onChange} >
          <Checkbox value='1'>Checkbox</Checkbox>
          <Checkbox value="Checkbox">Checkbox</Checkbox>
          <Checkbox value="2Checkbox">Checkbox</Checkbox>
        </CheckboxGroup>
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
    checkBoxGroup = formWrapper.find(CheckboxGroup)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('未触发trigger事件，未设置初始值，外部value情况', () => {
    expect(formRef.getFieldValue('checkbox')).toEqual([])
  })

  it('未触发trigger事件，已设置初始值，外部value情况', () => {
    formWrapper.setProps({ initialValue: ['1'] })
    expect(formRef.getFieldValue('checkbox')).toEqual(['1'])
  })

  it('触发trigger事件，外部value情况', () => {
    /**
     * 注意
     * simulate('change')是直接执行DomComponent中的props.onChange，所以不适用本案例
     * 你的Radio并没有props.onChange这个属性
     * 所以你可以直接获取内部的RcCheckbox
     * 利用直接触发onChange来模拟RcCheckbox的改变事件
     * 而且change事件必须加上参数
     */
    checkBoxGroup
      .find(RcCheckbox)
      .at(2)
      .props()
      .onChange({ target: { value: '2Checkbox' } })
    expect(formRef.getFieldValue('checkbox')).toEqual(['2Checkbox'])
  })
  

  it('dirty情况下，改变初始值，外部value情况', () => {
    checkBoxGroup.find(RcCheckbox).at(0).props().onChange({ target: { value: '1' } })
    checkBoxGroup.find(RcCheckbox).at(2).props().onChange({ target: { value: '2Checkbox' } })
    formWrapper.setProps({ initialValue: '2' })
    expect(formRef.getFieldValue('checkbox')).toEqual(['1','2Checkbox'])
  })

  it('非dirty状态下，改变初始值，外部value情况', () => {
    formRef.resetFieldsValue()
    formWrapper.setProps({ initialValue: ['2Checkbox'] })
    expect(formRef.getFieldValue('checkbox')).toEqual(['2Checkbox'])
  })

  it('setFieldsValue，外部value情况', () => {
    formRef.setFieldsValue({
      checkbox: ['1','2Checkbox']
    })
    expect(formRef.getFieldValue('checkbox')).toEqual(['1','2Checkbox'])

  })

  it('resetFieldsValue，外部value情况', () => {
    // 先预设初始值
    formWrapper.setProps({ initialValue: ['1'] })
    // 模拟点击
    checkBoxGroup
    .find(RcCheckbox)
    .at(2)
    .props()
    .onChange({ target: { value: ['2Checkbox'] } })
    // 重置
    formRef.resetFieldsValue()
    expect(formRef.getFieldValue('checkbox')).toEqual(['1'])
  })
})
