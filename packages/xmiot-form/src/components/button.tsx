import React, { Component } from 'react'
import { Popconfirm, Button } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import { wrapField } from './utils'
import { FormItemProps } from '../types'


class ConfirmButton extends Component<FormItemProps<'button'>> {
  render() {
    const { config = { cb: () => {} }, styles, props, name } = this.props
    const { cb, confirm } = config
    return wrapField(
      (
        confirm 
        ? <Popconfirm
            placement="topLeft"
            title={confirm}
            onConfirm={cb}
            okText="确认"
            cancelText="取消"
          >
            <Button {...props}>{name}</Button>
          </Popconfirm>
        : <Button onClick={cb} {...props}>{name}</Button>
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

export default ConfirmButton