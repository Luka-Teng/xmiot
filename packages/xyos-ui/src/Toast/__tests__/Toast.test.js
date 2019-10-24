import React from 'react'
import { mount, shallow } from 'enzyme'
import { Toast } from '../index.tsx'

describe('Toast', () => {

 // 注入 faker timer
  beforeEach(() => {
    jest.useFakeTimers(); // 声明当前测试文件使用模拟定时器，声明后可以直接使用
  });

  afterEach(() => {
    message.destroy();
    jest.useRealTimers();  // 使用真正的定时器
  });

  // 测试 message 的样式配置 top 
  test('should be able to config top', () => {
    message.config({
      top: 100,
    });
    message.success('whatever');
    expect(document.querySelectorAll('.message-notice')[0].style.top).toBe('100px');
  });

  // 测试 配置 maxCount
  test('should be able to config maxCount', () => {
    message.config({
      maxCount: 5,
    });
    for (let i = 0; i < 10; i += 1) {
      message.info('test');
    }
    message.info('last');
    expect(document.querySelectorAll('.message-notice').length).toBe(5);
    expect(document.querySelectorAll('.message-notice')[4].textContent).toBe('last');
    jest.runAllTimers();
    expect(document.querySelectorAll('.message-notice').length).toBe(0);
  });

  // 测试多个 message 不自动关闭的时候 调用 定时器是否自动关闭
  test('should be able to hide manually',()=>{
    const error1=message.error('错误1',0)
    const error2=message.error('错误2',0)
    const error3=message.error('错误3',0)
    expect(document.querySelectorAll('.message-notice').length).toBe(3)
    error1()
    jest.runAllTimers(); // 立即执行所有定时器
    expect(document.querySelectorAll('.message-notice').length).toBe(2)
    error2()
    jest.runAllTimers();
    expect(document.querySelectorAll('.message-notice').length).toBe(1)
    error1()
    jest.runAllTimers();
    expect(document.querySelectorAll('.message-notice').length).toBe(0)
  })

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
    expect(document.querySelectorAll('.message-notice').length).toBe(1);
    hide();
    jest.runAllTimers();
    expect(document.querySelectorAll('.message-notice').length).toBe(0);
  });



})