import React, { Component } from 'react';
import { mount, shallow } from 'enzyme'
import { RadioGroup, Radio } from '../index.tsx'

describe('RadioGroup', () => {

  test(`component could be updated and unmounted without errors`, () => {
    const wrapper = mount(<RadioGroup />);
    expect(() => {
      wrapper.setProps({});
      wrapper.unmount();
    }).not.toThrow();
  });

  test('responses events', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <RadioGroup name="platform" onChange={onChange}>
        <Radio value="PC" >选项一</Radio>
        <Radio value="APP">选项二</Radio>
        <Radio value="WAP">选项三</Radio>
      </RadioGroup>
    );
    wrapper.setState({ value: 'APP' });
    wrapper.find('.rc-radio-input').at(0).simulate('change');
    expect(onChange.mock.calls.length).toBe(1);  // 此mock 函数被调用了一次

    wrapper.setProps({ value: 'PC' });
    wrapper.find('.rc-radio-input').at(1).simulate('change');
    expect(onChange.mock.calls.length).toBe(2);// 此mock 函数被调用了2次

  })

  test('disabled', () => {
    const onChange = jest.fn()
    const wrapper = mount(
      <RadioGroup name="platform" onChange={onChange}>
        <Radio value="PC" disabled={true}>选项一</Radio>
        <Radio value="APP">选项二</Radio>
        <Radio value="WAP">选项三</Radio>
      </RadioGroup>
    );
    wrapper.find('.rc-radio-input').at(0).simulate('change');
    expect(onChange).not.toHaveBeenCalled();
  })
})