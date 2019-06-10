import React, { Component } from 'react'
import { wrapField } from './utils'
import { FormItemProps } from '../types'

class Custom extends Component<FormItemProps<'custom'>> {
  render () {
    const { name, config, styles, label } = this.props
    if (!config) throw new Error('custom组件必须要有config')

    const {
      appendElement,
      insertElement,
      render
    } = config

    return wrapField(render(), { ...styles, appendElement, insertElement }, Math.random().toLocaleString(), label)
  }
}

export default Custom
