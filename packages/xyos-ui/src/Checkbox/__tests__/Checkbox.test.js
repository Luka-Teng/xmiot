import React, { Component } from 'react';
import { mount, shallow } from 'enzyme'
import  { Checkbox } from '../index.tsx'

describe('Checkbox',()=>{

    // 渲染是否成功
    test(`component could be updated and unmounted without errors`, () => {
      const wrapper = mount(<Checkbox />);
      expect(() => {
        wrapper.setProps({});
        wrapper.unmount();
      }).not.toThrow();
    });

  // test('works', () => {
  //   const onChange = jest.fn();
  //   const wrapper = mount(<Checkbox onChange={onChange}>Checkbox</Checkbox>);
  //   expect(wrapper.state('checked')).toBe(false);
  //   wrapper.find('.rc-checkbox-input').simulate('change', { target: { checked: true } });
  //   expect(wrapper.state('checked')).toBe(true);
  //   wrapper.find('.rc-checkbox-input').simulate('change', { target: { checked: false } });
  //   expect(wrapper.state('checked')).toBe(false);
  // });

  test('responses hover events', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Checkbox onChange={onChange}>Checkbox</Checkbox>);
    wrapper.find('.rc-checkbox-input').at(0).simulate('change');
    expect(onChange).toHaveBeenCalled();

  });

  test('onChange disabled', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Checkbox onChange={onChange} disabled>Checkbox</Checkbox>);
    wrapper.find('.rc-checkbox-input').simulate('change');
    expect(onChange).not.toHaveBeenCalled();
  });


})