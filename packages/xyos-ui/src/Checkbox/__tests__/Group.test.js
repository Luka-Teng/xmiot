import React, { Component } from 'react';
import { mount } from 'enzyme'
import { Checkbox,CheckboxGroup } from '../index.tsx'

describe('Checkbox',()=>{

  // 渲染是否成功
  it(`component could be updated and unmounted without errors`, () => {
    const wrapper = mount(<CheckboxGroup />);
    expect(() => {
      wrapper.setProps({});
      wrapper.unmount();
    }).not.toThrow();
  });

 // 基础选择 
  test('should works',()=>{
    const onChange=jest.fn()
    const wrapper = mount(
      <CheckboxGroup options={['选项一', '选项二', '选项三']} onChange={onChange} />,
    );
 
       // 触发选择 选项一
    wrapper.find('.rc-checkbox-input').at(0).simulate('change');
    expect(onChange).toHaveBeenCalled();

    wrapper.find('.rc-checkbox-input').at(1).simulate('change');
    expect(onChange).toHaveBeenCalled()

    wrapper.find('.rc-checkbox-input').at(2).simulate('change');
    expect(onChange).toHaveBeenCalled()

    wrapper.find('.rc-checkbox-input').at(1).simulate('change');
    expect(onChange).toHaveBeenCalled()

  })

  // 当添加了 disabled 属性，所有checkbox 不可点击
  test('onChange no callback when CheckboxGroup is disabled',()=>{
    const onChange=jest.fn()
    const options = [{ label: 'Lei', value: 'lei' }, { label: 'Yan', value: 'yan' }];
    const groupWrapper=mount(
      <CheckboxGroup options={options} onChange={onChange} disabled />,
    );
    groupWrapper.find('.rc-checkbox-input').at(0).simulate('change');
    expect(onChange).not.toHaveBeenCalled();// 不应当有响应
    groupWrapper.find('.rc-checkbox-input').at(0).simulate('change');
    expect(onChange).not.toHaveBeenCalled();// 不应当有响应
  })

  // 如果是CheckboxGroup 没有 disabled，但是options 对象中含有 disabled
  test('onChange has callback ,when CheckboxGroup is not disabled',()=>{
    const onChange=jest.fn()
    const options = [{ label: 'Lei', value: 'lei' }, { label: 'Yan', value: 'yan', disabled:true }];
    const groupWrapper=mount(
      <CheckboxGroup options={options} onChange={onChange} />,
    );
    groupWrapper.find('.rc-checkbox-input').at(0).simulate('change');  // at(index)=>ReactWrapper
    expect(onChange).toHaveBeenCalled();// 应当有响应
    groupWrapper.find('.rc-checkbox-input').at(1).simulate('change');
    expect(onChange).toHaveBeenCalledTimes(1);// 不应当有响应
  })


  //  测试 默认选中 
  test('defaultValue',()=>{
    
  })

})