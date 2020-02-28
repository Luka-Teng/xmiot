import React from 'react'
import { mount, shallow } from 'enzyme'
import Toast from '../index.tsx'

describe('Toast', () => {


  function $$(className) {
    return document.body.querySelectorAll(className);
  }

  function getStyle(el, prop) {
    const style = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle;
    // If a css property's value is `auto`, it will return an empty string.
    return prop ? style[prop] : style;
  }

  function open(args) {
    Toast.open({
      message: 'Toast Title',
      description: 'This is the content of the Toast.',
      ...args,
    });
  }

  function config(args) {
    Toast.config({
      ...args,
    });
    open();
  }

  // 注入 faker timer
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  

  afterEach(() => {
    Toast.destroy()
  })

  // 测试多个 message 不自动关闭的时候 调用 定时器是否自动关闭

  // it('should be able to hide manually', () => {
  //   Toast.open({
  //     message: 'Toast Title',
  //     duration: 0,
  //     key: '1'
  //   })
  //   Toast.open({
  //     message: 'Toast Title',
  //     duration: 0,
  //     key: '2'
  //   })

  //   expect(document.querySelectorAll('.xyos-message-notice').length).toBe(2)
  //   Toast.close('1')
  //   jest.runAllTimers()
  //   expect(document.querySelectorAll('.xyos-message-notice').length).toBe(1)
  //   Toast.close('2')
  //   jest.runAllTimers()
  //   expect(document.querySelectorAll('.xyos-message-notice').length).toBe(0)
  // })

  // it('should be able to destroy globally', () => {
  //   Toast.open({
  //     message: 'Toast Title',
  //     duration: 0
  //   })
  //   Toast.open({
  //     message: 'Toast Title',
  //     duration: 0
  //   })
  //   expect(document.querySelectorAll('.xyos-message-notice').length).toBe(1)
  //   expect(document.querySelectorAll('.xyos-message-notice').length).toBe(2)
  //   Toast.destroy()
  //   expect(document.querySelectorAll('.xyos-message-notice').length).toBe(0)
  //   expect(document.querySelectorAll('.xyos-message-notice').length).toBe(0)
  // })

  // promise
  it('should be called like promise', done => {
    jest.useRealTimers() // 使用真正的定时器 否则异步执行会立即返回，导致状态判断出错
    const defaultDuration = 3
    const now = Date.now()
    Toast.info({
        content: 'Toast Title2',
        description: 'dfghjkl'
      }).then(() => {
        // calculate the approximately duration value
        const aboutDuration = parseInt((Date.now() - now) / 1000, 10)
        expect(aboutDuration).toBe(defaultDuration)
        done()
      })
  })

  // it('should hide message correctly', () => {
  //   let hide
  //   class Test extends React.Component {
  //     componentDidMount () {
  //       hide = Toast.warning('Action in progress..', 0)
  //     }
  //     render () {
  //       return <div>test</div>
  //     }
  //   }
  //   mount(<Test />)

  //   expect(document.querySelectorAll('.xyos-message-info').length).toBe(1)
  //   hide()
  //   jest.runAllTimers()
  //   expect(document.querySelectorAll('.xyos-message-info').length).toBe(0)
  // })

  it('trigger onClick', () => {
    Toast.open({
      message: 'Toast Title',
      duration: 0
    })
    expect(document.querySelectorAll('.xyos-message').length).toBe(1)
  })

  it('can be configured per Toast using the `open` method', () => {
    const defaultTop = '24px';
    const defaultBottom = '24px';
    let style;

    // topLeft
    open({
      placement: 'topLeft',
      top: 50,
    });
    style = getStyle($$('.xyos-message-topLeft')[0]);
    expect(style.top).toBe('50px');
    expect(style.left).toBe('0px');
    expect(style.bottom).toBe('');

    open({
      placement: 'topLeft',
    });
    expect($$('.xyos-message-topLeft').length).toBe(1);

    // topRight
    open({
      placement: 'topRight',
    });
    style = getStyle($$('.xyos-message-topRight')[0]);
    expect(style.top).toBe(defaultTop);
    expect(style.right).toBe('0px');
    expect(style.bottom).toBe('');

    open({
      placement: 'topRight',
    });
    expect($$('.xyos-message-topRight').length).toBe(1);

    // bottomRight
    open({
      placement: 'bottomRight',
      bottom: 100,
    });
    style = getStyle($$('.xyos-message-bottomRight')[0]);
    expect(style.top).toBe('');
    expect(style.right).toBe('0px');
    expect(style.bottom).toBe('100px');

    open({
      placement: 'bottomRight',
    });
    expect($$('.xyos-message-bottomRight').length).toBe(1);

    // bottomLeft
    open({
      placement: 'bottomLeft',
    });
    style = getStyle($$('.xyos-message-bottomLeft')[0]);
    expect(style.top).toBe('');
    expect(style.left).toBe('0px');
    expect(style.bottom).toBe(defaultBottom);

    open({
      placement: 'bottomLeft',
    });
    expect($$('.xyos-message-bottomLeft').length).toBe(1);
  });

  it('can be configured globally using the `config` method', () => {
    let style;


    // topLeft
    config({
      placement: 'topLeft',
      top: 50,
      bottom: 50,
    });
    style = getStyle($$('.xyos-message-topLeft')[0]);
    expect(style.top).toBe('50px');
    expect(style.left).toBe('0px');
    expect(style.bottom).toBe('');

    // topRight
    config({
      placement: 'topRight',
      top: 100,
      bottom: 50,
    });
    style = getStyle($$('.xyos-message-topRight')[0]);
    expect(style.top).toBe('100px');
    expect(style.right).toBe('0px');
    expect(style.bottom).toBe('');

    // bottomRight
    config({
      placement: 'bottomRight',
      top: 50,
      bottom: 100,
    });
    style = getStyle($$('.xyos-message-bottomRight')[0]);
    expect(style.top).toBe('');
    expect(style.right).toBe('0px');
    expect(style.bottom).toBe('100px');

    // bottomLeft
    config({
      placement: 'bottomLeft',
      top: 100,
      bottom: 50,
    });
    style = getStyle($$('.xyos-message-bottomLeft')[0]);
    expect(style.top).toBe('');
    expect(style.left).toBe('0px');
    expect(style.bottom).toBe('50px');
  });



})
