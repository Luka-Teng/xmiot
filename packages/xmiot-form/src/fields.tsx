import React, { PureComponent } from 'react'

import { FieldsProps } from './types'
import Input from './components/input'

class Fields extends PureComponent<FieldsProps> {
  input = (option: FieldsProps['options'][number]) => {
    return <Input {...option} form={this.props.form} />
  }

  select = (option: FieldsProps['options'][number]) => {
    return <Input {...option} form={this.props.form} />
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