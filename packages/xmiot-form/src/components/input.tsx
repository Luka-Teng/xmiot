import React, { PureComponent } from 'react'
import AntInput from 'antd/lib/input'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

type InputItemProps = FormItemProps<'input'>

class Input extends PureComponent<InputItemProps> {
  render () {
    const {
      name,
      label,
      props,
      styles = {},
      config = {},
      form: { getFieldDecorator }
    } = this.props

    const { initialValue = '', rules = [] } = config

    return wrapField(getFieldDecorator(name, {
      initialValue,
      rules
    })(
      <AntInput placeholder={label} {...props} />
    ), styles, name, label)
  }
}

export default Input