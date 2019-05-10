import React, { Component } from 'react'
import { wrapField } from './utils'
import { FormItemProps } from '../types'

class Button extends Component<FormItemProps<'custom'>> {
  render () {
    const { name, config, styles, label } = this.props
    if (!config) throw new Error('custom组件必须要有config')
    const { render } = config
    return wrapField(render(), styles, Math.random().toLocaleString(), label)
  }
}

export default Button
