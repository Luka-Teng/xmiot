import React, { PureComponent } from 'react'
import { Input as AntInput } from 'antd'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

class Input extends PureComponent<FormItemProps<'input'>> {
  render() {
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
      onChange,
      appendElement,
      insertElement
    } = config

    return wrapField(
      getFieldDecorator(name, {
        initialValue,
        rules
      })(<AntInput placeholder={label} {...props} onChange={onChange} />),
      { ...styles, appendElement, insertElement },
      name,
      label
    )
  }
}

export default Input
