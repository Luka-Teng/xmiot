import React, { Component } from 'react'

import './assets/index.less'
import Form from './form'

import { FormProps } from './types'

export default class Index extends Component<
  Pick<
    FormProps,
    | 'options'
    | 'onSubmit'
    | 'confirmButton'
    | 'extraButtons'
    | 'formRef'
    | 'styles'
  >
> {
  state = { hasError: false }

  static getDerivedStateFromError () {
    return { hasError: true }
  }
  componentDidCatch (error: any, info: any) {
    console.error(error)
  }
  render () {
    return this.state.hasError ? <div /> : <Form {...this.props} />
  }
}
