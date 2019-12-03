import React from 'react'
import { mount } from 'enzyme'
import { Label } from '../index.tsx'

describe('测试Label', () => {

  it('应该正确获取props',()=>{
    const wrapper= mount(
      <Label
        align='center'
        label="labelName"
        required={true}
        style={{ fontSize: '14px', height: '100px', width: '400px', }}
        content={<h1>我是children</h1>}>
        <h1>我是children</h1>
      </Label>
    )
    var wi = wrapper.instance()
    expect( wi.props.label ).toEqual( "labelName" )
	  expect( wi.props.align ).toEqual( "center" )
	  expect( wi.props.required ).toBeTruthy()
    expect( wi.props.style.toString() ).toEqual( "[object Object]" )
  })

  it('正确的渲染内容', () => {
    const wrapper = mount(
      <Label
        align='center'
        label="labelName"
        required={true}
        style={{ fontSize: '14px', height: '100px', width: '400px', }}
        content={<h2>我是children</h2>}>
        <h1>我是children</h1>
      </Label>
    )
    expect(wrapper.find('h1')).toBeTruthy()
    expect(wrapper.find('.yx-label-wrapper').get(0).props.style).toHaveProperty('height', '100px')
  })

})