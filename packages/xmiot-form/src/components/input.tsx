import React, { PureComponent } from 'react'
import AntInput from 'antd/lib/input'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

type InputItemProps = FormItemProps<'InputConfig'>

class Input extends PureComponent<InputItemProps> {
  render () {
    const {
      name,
      label,
      props,
      styles = {},
      config = {},
      form
    } = this.props

    const { initialValue = '', rules = [] } = config
    const { getFieldDecorator } = this.props.form

    return wrapField(getFieldDecorator(name, {
      initialValue,
      rules
    })(
      <AntInput placeholder={label} {...props} />
    ), styles, name, label)
  }
}

export default Input