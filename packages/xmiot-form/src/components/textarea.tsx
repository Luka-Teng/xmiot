import React, { PureComponent } from 'react'
import { Input as AntInput } from 'antd'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

class Textarea extends PureComponent<FormItemProps<'textarea'>> {
  render () {
    const {
      name,
      label,
      props,
      styles,
      config = {},
      form: { getFieldDecorator }
    } = this.props

    const {
      initialValue = '',
      rules = [],
      resize = false,
      rows = 5,
      onChange,
      onPressEnter
    } = config

    return wrapField(getFieldDecorator(name, {
      initialValue,
      rules
    })(
      <AntInput.TextArea 
        placeholder={label}
        {...props}
        rows={rows}
        onChange={onChange}
        onPressEnter={onPressEnter}
        style={{resize: resize ? 'both' : 'none'}}
      />
    ), styles, name, label)
  }
}

export default Textarea