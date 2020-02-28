import { mount } from 'enzyme'
import React from 'react'
import { createForm } from '../index'
import Message from '../../Message'

describe('Message test',()=>{

  function CreatMessage(props){
    Message({
      title: '确认要删除这条信息吗？',
      type: 'error',
      message: '仅支持图片的上传'
    })
  }

  test('Button render should be render', () => {  
    // const wrapper = mount(CreatMessage())
    // wrapper.find('.xyos-messageBox').toBe(true)
  })

})