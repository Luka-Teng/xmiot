import React, { Component } from 'react'
import { Popconfirm, Button as AntButton } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import { wrapField } from './utils'
import { FormItemProps } from '../types'
import ConfirmButton from './innerComponents/confirmButton'


class Button extends Component<FormItemProps<'button'>> {
  render() {
    const { config = { cb: () => {} }, styles, props, name } = this.props
    const { cb, confirm } = config
    return wrapField(
      (
        <ConfirmButton cb={cb} {...props} confirm={confirm}>{name}</ConfirmButton>
      ),
      {
        itemStyle: {
          textAlign: 'right'
        },
        ...styles
      },
      Math.random().toLocaleString()
    )
  }
}

export default Button