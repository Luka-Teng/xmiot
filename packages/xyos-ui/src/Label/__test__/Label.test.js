import React from 'react'
import { mount, shallow } from 'enzyme'
import { Label } from '../index.tsx'

describe('Label', () => {

  test('Label render should be render',()=>{
    const wrapper= shallow(
      <Label label='labelName'>
        label
      </Label>
    )
    expect(wrapper.text()).toEqual('label')
  })

})