import React, { Component } from 'react'
import { wrapField } from './utils'
import { FormItemProps } from '../types'


class Button extends Component<FormItemProps<'custom'>> {
  render() {
    const { name, config, styles } = this.props
    if (!config) throw new Error('custom组件必须要有config')
    const { render } = config
    return wrapField(
      render(),
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