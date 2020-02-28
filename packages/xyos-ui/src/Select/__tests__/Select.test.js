import React from 'react'
import { mount } from 'enzyme'
import Select from '../../Select'
import Button from '../../Button'
import { act } from 'react-dom/test-utils';

// eslint-disable-next-line jest/no-export
function mountTest(Component) {
  describe(`mount and unmount`, () => {
    it(`component could be updated and unmounted without errors`, () => {
      const wrapper = mount(<Component />);
      expect(() => {
        wrapper.setProps({});
        wrapper.unmount();
      }).not.toThrow();
    });
  });
}


describe('Select test',()=>{

  function toggleOpen(wrapper) {
    act(() => {
      wrapper.find('.rc-select-selector').simulate('mousedown');
      jest.runAllTimers();
      wrapper.update();
    });
  }
  
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  mountTest(Select);

  it('should have default notFoundContent', () => {
    const wrapper = mount(<Select mode="multiple" />);
    toggleOpen(wrapper);
    expect(wrapper.find('.rc-select-item-option').length).toBeFalsy();
    // expect(wrapper.find('.rc-empty').length).toBeTruthy();
  });

  it('should support set notFoundContent to null', () => {
    const wrapper = mount(<Select mode="multiple" notFoundContent={null} />);
    toggleOpen(wrapper);
    const dropdownWrapper = mount(
      wrapper
        .find('Trigger')
        .instance()
        .getComponent(),
    );
    expect(dropdownWrapper.find('MenuItem').length).toBe(0);
  });

  it('should not have notFoundContent when mode is combobox and notFoundContent is set', () => {
    const wrapper = mount(
      <Select mode={Select.SECRET_COMBOBOX_MODE_DO_NOT_USE} notFoundContent="not at all" />,
    );
    toggleOpen(wrapper);
    const dropdownWrapper = mount(
      wrapper
        .find('Trigger')
        .instance()
        .getComponent(),
    );
    expect(dropdownWrapper.find('.rc-select-item-option').length).toBeFalsy();
    expect(
      dropdownWrapper
        .find('.rc-select-item-empty')
        .at(0)
        .text(),
    ).toBe('not at all');
  });

  it('should be controlled by open prop', () => {
    const onDropdownVisibleChange = jest.fn();
    const wrapper = mount(
      <Select open onDropdownVisibleChange={onDropdownVisibleChange}>
        <Option value="1">1</Option>
      </Select>,
    );
    let dropdownWrapper = mount(
      wrapper
        .find('Trigger')
        .instance()
        .getComponent(),
    );
    expect(dropdownWrapper.props().visible).toBe(true);
    toggleOpen(wrapper);
    expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(false);
    expect(dropdownWrapper.props().visible).toBe(true);

    wrapper.setProps({ open: false });
    dropdownWrapper = mount(
      wrapper
        .find('Trigger')
        .instance()
        .getComponent(),
    );
    expect(dropdownWrapper.props().visible).toBe(false);
    toggleOpen(wrapper);
    expect(onDropdownVisibleChange).toHaveBeenLastCalledWith(true);
    expect(dropdownWrapper.props().visible).toBe(false);
  });


})