import React, { Component } from 'react'
import { Form as AntForm } from 'antd'

import { FormProps } from './types'
import Fields from './fields'
import Button from './components/button'

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

  handleSubmit = (e? :React.MouseEvent<any>) => {
    e && e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { onSubmit } = this.props
        onSubmit && onSubmit(values)
      } else {
        throw err
      }
    })
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

    if (confirmButton) {
      options.push({
        type: 'button',
        name: confirmButton.name || '确认',
        styles: {
          display: '1/1',
          ...confirmButton.styles
        },
        config: {
          confirm: confirmButton.confirm,
          cb: this.handleSubmit
        },
        props: confirmButton.props
      })
    }
    
    if (extranButtons) {
      options.push(...(extranButtons || []).map<FormProps['options'][number]>(button => {
        return {
          type: 'button',
          name: button.name || '确认',
          styles: {
            display: '1/1',
            ...button.styles
          },
          config: {
            confirm: button.confirm,
            cb: button.cb
          },
          props: button.props
        }
      }))
    }

    return (
      <AntForm className="xmiot-form">
        <Fields options={options} styles={styles} form={form} />
      </AntForm>
    )
  }
}

export default AntForm.create()(Form)
