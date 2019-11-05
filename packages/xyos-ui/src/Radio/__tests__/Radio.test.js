import React, { Component } from 'react';
import { mount, shallow } from 'enzyme'
import { Radio, RadioGroup } from '../index.tsx'

describe('Radio',()=>{

  test(`component could be updated and unmounted without errors`, () => {
    const wrapper = mount(<Radio />);
    expect(() => {
      wrapper.setProps({});
      wrapper.unmount();
    }).not.toThrow();
  });

  test('onChange disabled', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const onChange = jest.fn();
    const wrapper = mount(
      <RadioGroup name="platform"  onChange={onChange}>
      <Radio value="PC" disabled={true}>选项一</Radio>
    </RadioGroup>
    );
    wrapper.find('.rc-radio-input').simulate('change');
    expect(onChange).not.toHaveBeenCalled();
  });

})