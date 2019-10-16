import React from 'react'
import { mount } from 'enzyme'
import { ScrollTrigger } from '../index.tsx'
import { spyElementPrototype } from 'root/tests/shared/domMock'

describe('ScrollTrigger', () => {

  let container
  let domMock

  beforeAll(() => {
    jest.useFakeTimers()

    /* 根据className值来判断是否是在视窗外 */
    domMock = spyElementPrototype(HTMLElement, 'getBoundingClientRect', function () {
      if (this.className === 'outside') {
        return {
          top: 1000
        }
      }
      return {
        top: 0
      }
    })
  })

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterAll(() => {
    jest.useRealTimers()
    domMock.mockRestore()
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should not be found if outside the view', () => {
    /* 必须mount在某个dom上，内部的setState才会更新, 不知为何 */
    const wrapper = mount(
      <ScrollTrigger
        className="outside"
      >
        <div id="child">11111</div>
      </ScrollTrigger>,
      { attachTo: container }
    )
    jest.runAllTimers()
    wrapper.update()
    expect(wrapper.find('#child').length).toBe(0)
  })

  it('should be found if inside the view', () => {
    const wrapper = mount(
      <ScrollTrigger>
        <div id="child">11111</div>
      </ScrollTrigger>,
      { attachTo: container }
    )
    jest.runAllTimers()
    wrapper.update()
    expect(wrapper.find('#child').length).toBe(1)
  })

  it('show the elments after the delay', () => {
    const wrapper = mount(
      <ScrollTrigger
        delay={1000}
      >
        <div id="child">11111</div>
      </ScrollTrigger>,
      { attachTo: container }
    )
    
    /* 时间快进200ms，delay开始，子元素未渲染 */
    jest.advanceTimersByTime(200)
    wrapper.update()
    expect(wrapper.find('#child').length).toBe(0)

    /* 时间快进1000ms，delay完毕，子元素渲染 */
    jest.advanceTimersByTime(1000)
    wrapper.update()
    expect(wrapper.find('#child').length).toBe(1)
  })
})