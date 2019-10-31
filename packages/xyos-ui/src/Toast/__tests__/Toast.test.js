import React from 'react'
import { mount, shallow } from 'enzyme'
import { Toast } from '../index.tsx'

describe('Toast', () => {

  let message=Toast
 

 // 注入 faker timer
  beforeEach(() => {
    jest.useFakeTimers(); // 声明当前测试文件使用模拟定时器，声明后可以直接使用
  });

  afterEach(() => {
    console.log(message,'9999')
    message.destroy();
    jest.useRealTimers();  // 使用真正的定时器
  });

  // 测试 message 的样式配置 top 
  // test('should be able to config top', () => {
  //   message.config({
  //     top: 100,
  //   });
  //   message.success('whatever');
  //   expect(document.querySelectorAll('.message-notice')[0].style.top).toBe('100px');
  // });

  // 测试 配置 maxCount
  // test('should be able to config maxCount', () => {
  //   message.config({
  //     maxCount: 5,
  //   });
  //   for (let i = 0; i < 10; i += 1) {
  //     message.info('test');
  //   }
  //   message.info('last');
  //   expect(document.querySelectorAll('.message-notice').length).toBe(5);
  //   expect(document.querySelectorAll('.message-notice')[4].textContent).toBe('last');
  //   jest.runAllTimers();
  //   expect(document.querySelectorAll('.message-notice').length).toBe(0);
  // });

  // 测试多个 message 不自动关闭的时候 调用 定时器是否自动关闭

  it('should be able to hide manually', () => {
    const hide1 = message.info('whatever', 0);
    const hide2 = message.info('whatever', 0);
    console.log(document.querySelectorAll('.message-notice-info').length,'8888')
    expect(document.querySelectorAll('.message-notice-info').length).toBe(2);
    console.log(hide1(),'hide')
    hide1();
    jest.runAllTimers();
    expect(document.querySelectorAll('.message-notice-info').length).toBe(1);
    hide2();
    jest.runAllTimers();
    expect(document.querySelectorAll('.message-notice-info').length).toBe(0);
  });


  // promise
  test('should be called like promise', done => {
    jest.useRealTimers();  // 使用真正的定时器 否则异步执行会立即返回，导致状态判断出错
    const defaultDuration = 3;
    const now = Date.now();
    message.info('whatever').then(() => {
      // calculate the approximately duration value
      const aboutDuration = parseInt((Date.now() - now) / 1000, 10);
      expect(aboutDuration).toBe(defaultDuration);
      done();
    });
  });

  // 可以没有duration 第二个参数，直接加第三个参数onClose 关闭之后触发的函数
  test('should not need to use duration argument when using the onClose arguments', () => {
    message.info('whatever', () => {});
  });

  test('should hide message correctly', () => {
    let hide;
    class Test extends React.Component {
      componentDidMount() {
        hide = message.loading('Action in progress..', 0);
      }
      render() {
        return <div>test</div>;
      }
    }
    mount(<Test />);
    
    expect(document.querySelectorAll('.message-notice-loading').length).toBe(1);
    hide();
    jest.runAllTimers();
    console.log(document.querySelectorAll('.message-notice').length,'3456890')
    expect(document.querySelectorAll('.message-notice-loading').length).toBe(0);
  });



})