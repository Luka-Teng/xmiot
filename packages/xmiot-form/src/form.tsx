import React, { Component } from 'react'
import { Form as AntForm, Col } from 'antd'

import { FormProps } from './types'
import Fields from './fields'
import ConfirmButton from './components/innerComponents/confirmButton'

class Form extends Component<FormProps> {
  static defaultProps: Readonly<Partial<FormProps>> = {
    extraButtons: []
  }

  componentDidMount () {
    const resetFormRef = (ref: any, form: FormProps['form']) => {
      ref.current = form
    }
    let { formRef, form } = this.props
    if (formRef) resetFormRef(formRef, form)
  }

  handleSubmit = (e?: React.MouseEvent<any>) => {
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

  render () {
    let {
      options,
      onSubmit,
      extraButtons,
      confirmButton,
      form,
      styles
    } = this.props

    return (
      <AntForm className="xmiot-form">
        <Fields options={options} styles={styles} form={form} />
        <Col span={24} style={{ textAlign: 'right' }}>
          {extraButtons &&
            extraButtons.map(button => {
              return (
                <ConfirmButton
                  style={buttonStyle}
                  cb={button.cb}
                  confirm={button.confirm}
                  {...button.props}
                >
                  {button.name}
                </ConfirmButton>
              )
            })}
          {confirmButton && (
            <ConfirmButton
              style={buttonStyle}
              cb={this.handleSubmit}
              confirm={confirmButton.confirm}
              {...confirmButton.props}
            >
              {confirmButton.name}
            </ConfirmButton>
          )}
        </Col>
      </AntForm>
    )
  }
}

const buttonStyle = {
  margin: '0px 10px'
}

export default AntForm.create()(Form)
