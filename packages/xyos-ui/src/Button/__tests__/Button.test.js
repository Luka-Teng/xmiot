import React, { Component } from 'react';
import { mount, shallow } from 'enzyme'
import { Button } from '../index.tsx'


describe('Button', () => {

  test('Button render should be render',()=>{
    const wrapper= shallow(<Button>测试</Button>)
    expect(wrapper.find('.button').exists())
  })

  test('should render empty button without errors', () => {
    const wrapper = shallow(
      <Button>
        {null}
        {undefined}
      </Button>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  
  test('TodoComponent renders the text inside it', () => {
    const type = 'primary';
    const wrapper = shallow(
      <Button type={type}>Hello Jest!</Button>
    );
    // expect(wrapper).to.have.lengthOf(1);
    expect(wrapper.length).toBe(1);
  });
  
  
  test('Button calls doneChange when todo is clicked', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
      <Button  onClick={onClick}>点击</Button>
    );
    // 判断 props onClick 是否被调用
    wrapper.simulate('click');
    expect(onClick).toBeCalled() 
  });
  

// 测试loading button
  test('测试加载中', () => {
    class DefaultButton extends Component {
      state = {
        loading: false,
      };
      enterLoading = () => {
        this.setState({ loading: true });
      }
      render() {
        return <Button loading={this.state.loading} onClick={this.enterLoading}>Button</Button>;
      }
    }
    const wrapper = shallow(
      <DefaultButton />
    );
    wrapper.simulate('click');
    expect(wrapper.hasClass('.button-loading').length).toBe(1);
  });

// 测试 Button props 的type
test('test Button props type',()=>{
  const wrapper = shallow(
    <Button  type='primary'>点击</Button>
  );
  expect(wrapper.hasClass('button-primary')).toEqual(true)
})

  // 测试 Button props 的type
  test('test Button children text',()=>{
    const wrapper = shallow(
      <Button  type='primary'>点击</Button>
    );
    expect(wrapper.text()).toEqual('点击')
  })

})

