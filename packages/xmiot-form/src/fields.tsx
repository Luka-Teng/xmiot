import React, { PureComponent } from 'react'

import { FieldsProps } from './types'
import Input from './components/input'
import Select from './components/select'

class Fields extends PureComponent<FieldsProps> {
  input = (option: any) => {
    return <Input {...option} form={this.props.form} />
  }

  select = (option: any) => {
    return <Select {...option} form={this.props.form} />
  }

  render () {
    const views: React.ReactNode[] = []
    const { options, styles } = this.props
    options.forEach((option, index) => {
      option.styles = Object.assign({}, styles, option.styles)
      views.push(<div key={index}>{this[option.type](option)}</div>)
    })
    return views
  }
}

export default Fields