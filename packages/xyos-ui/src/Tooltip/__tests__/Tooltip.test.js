import React from 'react'
import { mount } from 'enzyme'
import Tooltip from '../../Tooltip'
import Button from '../../Button'

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


describe('test tooltip',()=>{
  mountTest(Tooltip);

  it('未触发的时候，是否挂载',()=>{
   const wrapper = mount(
    <Tooltip title='这是一个Tooltip，这是一个Tooltip'>
     <Button>TL</Button>
   </Tooltip>
   )
   expect(wrapper.find('.xyos-tooltip')).toMatchSnapshot()
  })


  it( 'check `onVisibleChange` arguments',()=>{
    const onVisibleChange = jest.fn();
    const wrapper = mount(
      <Tooltip title="" mouseEnterDelay={0} mouseLeaveDelay={0} onVisibleChange={onVisibleChange}>
        <div id="hello">Hello world!</div>
      </Tooltip>,
    );

    // `title` is empty.
    const div = wrapper.find('#hello').at(0);
    div.simulate('mouseenter');
    expect(onVisibleChange).not.toHaveBeenCalled();
    // console.log(wrapper.instance().tooltip.current.props,'000')
    expect(wrapper.instance().tooltip.current.props.visible).toBe(false);

    div.simulate('mouseleave');
    expect(onVisibleChange).not.toHaveBeenCalled();
    expect(wrapper.instance().tooltip.current.props.visible).toBe(false);

    // update `title` value.
    wrapper.setProps({ title: 'Have a nice day!' });
    wrapper.find('#hello').simulate('mouseenter');
    expect(onVisibleChange).toHaveBeenLastCalledWith(true);
    expect(wrapper.instance().tooltip.current.props.visible).toBe(true);

    // add `visible` props.
    wrapper.setProps({ visible: false });
    wrapper.find('#hello').simulate('mouseenter');
    expect(onVisibleChange).toHaveBeenLastCalledWith(true);
    const lastCount = onVisibleChange.mock.calls.length;
    expect(wrapper.instance().tooltip.current.props.visible).toBe(false);

    // always trigger onVisibleChange
    wrapper.simulate('mouseleave');
    expect(onVisibleChange.mock.calls.length).toBe(lastCount); // no change with lastCount
    expect(wrapper.instance().tooltip.current.props.visible).toBe(false);
  })

  it('should hide when mouse leave native disabled button', () => {
    const onVisibleChange = jest.fn();
    const wrapper = mount(
      <Tooltip
        title="xxxxx"
        mouseEnterDelay={0}
        mouseLeaveDelay={0}
        onVisibleChange={onVisibleChange}
      >
        <button type="button" disabled>
          Hello world!
        </button>
      </Tooltip>,
    );

    expect(wrapper.find('span')).toHaveLength(1);
    const button = wrapper.find('span').at(0);
    button.simulate('mouseenter');
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    expect(wrapper.instance().tooltip.current.props.visible).toBe(true);

    button.simulate('mouseleave');
    expect(onVisibleChange).toHaveBeenCalledWith(false);
    expect(wrapper.instance().tooltip.current.props.visible).toBe(false);
  });

  describe('should hide when mouse leave antd disabled component', () => {
    function testComponent(name, Component) {
      it(name, () => {
        const onVisibleChange = jest.fn();
        const wrapper = mount(
          <Tooltip
            title="xxxxx"
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
            onVisibleChange={onVisibleChange}
          >
            <Component disabled />
          </Tooltip>,
        );

        expect(wrapper.render()).toMatchSnapshot();
        const button = wrapper.find('span').at(0);
        button.simulate('mouseenter');
        expect(onVisibleChange).toHaveBeenCalledWith(true);
        expect(wrapper.instance().tooltip.current.props.visible).toBe(true);

        button.simulate('mouseleave');
        expect(onVisibleChange).toHaveBeenCalledWith(false);
        expect(wrapper.instance().tooltip.current.props.visible).toBe(false);
      });
    }

    testComponent('Button', Button);
  });

  it('use arrowPointAtCenter', () => {
    const wrapper = mount(
      <div>
        <Tooltip placement="topLeft" title="Prompt Text">
          <Button>Align edge / 边缘对齐</Button>
        </Tooltip>
        <Tooltip placement="topLeft" title="Prompt Text" arrowPointAtCenter>
          <Button>Arrow points to center / 箭头指向中心</Button>
        </Tooltip>
      </div>
    );
    expect(wrapper.find('.xyos-tooltip')).toMatchSnapshot()
  })

  it('use placement',() => {
    const text='测试'
    const wrapper = mount(<div>
          <div style={{ marginLeft: 60 }}>
            <Tooltip placement="topLeft" title={text}>
              <a href="#">TL</a>
            </Tooltip>
            <Tooltip placement="top" title={text}>
              <a href="#">Top</a>
            </Tooltip>
            <Tooltip placement="topRight" title={text}>
              <a href="#">TR</a>
            </Tooltip>
          </div>
          <div style={{ width: 60, float: 'left' }}>
            <Tooltip placement="leftTop" title={text}>
              <a href="#">LT</a>
            </Tooltip>
            <Tooltip placement="left" title={text}>
              <a href="#">Left</a>
            </Tooltip>
            <Tooltip placement="leftBottom" title={text}>
              <a href="#">LB</a>
            </Tooltip>
          </div>
          <div style={{ width: 60, marginLeft: 270 }}>
            <Tooltip placement="rightTop" title={text}>
              <a href="#">RT</a>
            </Tooltip>
            <Tooltip placement="right" title={text}>
              <a href="#">Right</a>
            </Tooltip>
            <Tooltip placement="rightBottom" title={text}>
              <a href="#">RB</a>
            </Tooltip>
          </div>
          <div style={{ marginLeft: 60, clear: 'both' }}>
            <Tooltip placement="bottomLeft" title={text}>
              <a href="#">BL</a>
            </Tooltip>
            <Tooltip placement="bottom" title={text}>
              <a href="#">Bottom</a>
            </Tooltip>
            <Tooltip placement="bottomRight" title={text}>
              <a href="#">BR</a>
            </Tooltip>
          </div>
        </div>)
     expect(wrapper.find('.xyos-tooltip')).toMatchSnapshot()
  })
})