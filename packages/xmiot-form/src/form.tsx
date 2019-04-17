import React, { Component } from 'react'
import { Form as AntForm } from 'antd'

import { FormProps } from './types'
import Fields from './fields'

const defaultConfirmButtonProps = {
  doubleCheck: false,
  name: '确认',
  props: {}
}

class Form extends Component<FormProps> {
  static defaultProps: Readonly<Partial<FormProps>> = {
    extranButtons: []
  }

  componentDidMount() {
    const resetFormRef = (ref: any, form: FormProps['form']) => {
      ref.current = form
    }
    let { formRef, form } = this.props
    if (formRef) resetFormRef(formRef, form)
  }

  render() {
    let {
      options,
      onSubmit,
      extranButtons,
      confirmButton,
      form,
      styles
    } = this.props

    /* 确认按钮可以在对象内独立修改 */
    confirmButton = Object.assign({}, defaultConfirmButtonProps, confirmButton)

    return (
      <AntForm className="xmiot-form">
        <Fields options={options} styles={styles} form={form} />
      </AntForm>
    )
  }
}

export default AntForm.create()(Form)
