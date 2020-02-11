import React from 'react'
import { mount, shallow } from 'enzyme'
import Toast from '../index.tsx'

describe('Toast', () => {
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

  it('should be able to hide manually', () => {
    Toast.open({
      message: 'Toast Title',
      duration: 0,
      key: '1'
    })
    Toast.open({
      message: 'Toast Title',
      duration: 0,
      key: '2'
    })

    expect(document.querySelectorAll('.xyos-message-notice').length).toBe(2)
    Toast.close('1')
    jest.runAllTimers()
    expect(document.querySelectorAll('.xyos-message-notice').length).toBe(1)
    Toast.close('2')
    jest.runAllTimers()
    expect(document.querySelectorAll('.xyos-message-notice').length).toBe(0)
  })

  it('should be able to destroy globally', () => {
    Toast.open({
      message: 'Toast Title',
      duration: 0
    })
    Toast.open({
      message: 'Toast Title',
      duration: 0
    })
    expect(document.querySelectorAll('.xyos-message-notice').length).toBe(1)
    expect(document.querySelectorAll('.xyos-message-notice').length).toBe(2)
    Toast.destroy()
    expect(document.querySelectorAll('.xyos-message-notice').length).toBe(0)
    expect(document.querySelectorAll('.xyos-message-notice').length).toBe(0)
  })

  // promise
  test('should be called like promise', done => {
    jest.useRealTimers() // 使用真正的定时器 否则异步执行会立即返回，导致状态判断出错
    const defaultDuration = 3
    const now = Date.now()
    message
      .info({
        content: 'Toast Title2',
        description: 'dfghjkl'
      })
      .then(() => {
        // calculate the approximately duration value
        const aboutDuration = parseInt((Date.now() - now) / 1000, 10)
        expect(aboutDuration).toBe(defaultDuration)
        done()
      })
  })

  test('should hide message correctly', () => {
    let hide
    class Test extends React.Component {
      componentDidMount () {
        hide = message.loading('Action in progress..', 0)
      }
      render () {
        return <div>test</div>
      }
    }
    mount(<Test />)

    expect(document.querySelectorAll('.xyos-message-info').length).toBe(1)
    hide()
    jest.runAllTimers()
    expect(document.querySelectorAll('.xyos-message-info').length).toBe(0)
  })

  it('trigger onClick', () => {
    Toast.open({
      message: 'Toast Title',
      duration: 0
    })
    expect(document.querySelectorAll('.xyos-message').length).toBe(1)
  })
})
