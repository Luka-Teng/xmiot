import React, { PureComponent } from 'react'

import { FieldsProps } from './types'
import Input from './components/input'
import Select from './components/select'
import Textarea from './components/textarea'
import DatePicker from './components/datePicker'
import CheckGroup from './components/checkGroup'
import Upload from './components/upload'
import RadioGroup from './components/radioGroup'
import ColorPicker from './components/colorPicker'
import Button from './components/button'

class Fields extends PureComponent<FieldsProps> {
  input = (option: any) => {
    return <Input {...option} form={this.props.form} />
  }

  select = (option: any) => {
    return <Select {...option} form={this.props.form} />
  }

  textarea = (option: any) => {
    return <Textarea {...option} form={this.props.form} />
  }

  datePicker = (option: any) => {
    return <DatePicker {...option} form={this.props.form} />
  }

  checkGroup = (option: any) => {
    return <CheckGroup {...option} form={this.props.form} />
  }

  upload = (option: any) => {
    return <Upload {...option} form={this.props.form} />
  }

  radioGroup = (option: any) => {
    return <RadioGroup {...option} form={this.props.form} />
  }

  colorPicker = (option: any) => {
    return <ColorPicker {...option} form={this.props.form} />
  }

  button = (option: any) => {
    return <Button {...option} form={this.props.form} />
  }

  render() {
    const views: React.ReactNode[] = []
    const { options, styles } = this.props
    options.forEach((option, index) => {
      /* 合并formStyle和itemStyle */
      option.styles = Object.assign({}, styles, option.styles)
      views.push(<div key={index}>{this[option.type](option)}</div>)
    })
    return views
  }
}

export default Fields
