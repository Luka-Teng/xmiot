import React, { PureComponent } from 'react'
import { Popconfirm, Button as AntButton } from 'antd'
import { ButtonProps } from 'antd/lib/button'

type props = {
  confirm?: string
  cb: (e?: React.MouseEvent<any>) => void
} & ButtonProps

class ConfirmButton extends PureComponent<props> {
  render () {
    const { cb, confirm, children, ...rest } = this.props
    return (
      confirm 
        ? <Popconfirm
            placement="topLeft"
            title={confirm}
            onConfirm={cb}
            okText="确认"
            cancelText="取消"
          >
            <AntButton {...rest}>{children}</AntButton>
          </Popconfirm>
        : <AntButton onClick={cb} {...rest}>{children}</AntButton>
    )
  }
}

export default ConfirmButton