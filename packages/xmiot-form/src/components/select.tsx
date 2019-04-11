import React, { PureComponent } from 'react'
import AntSelect from 'antd/lib/select'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

type SelectItemProps = FormItemProps<'select'>

const AntOption = AntSelect.Option

class Select extends PureComponent<SelectItemProps> {
  render () {
    const {
      name,
      label,
      props,
      styles = {},
      /* 由于config可以为undefined，所以必须加上初始值 */
      config = {
        data: []
      },
      form: { getFieldDecorator }
    } = this.props
    
    const { initialValue = null, rules = [], multi = false, onSelectChange = () => {}, data } = config

    return wrapField(getFieldDecorator(name, {
      initialValue: initialValue || (multi ? [] : ''),
      rules
    })(
      <AntSelect onChange={onSelectChange} placeholder={label} {...props} mode={multi ? 'multiple' : ''} >
        { data.map((d) => <AntOption key={d.name} value={d.value}>{ d.name }</AntOption>) }
      </AntSelect>
    ), styles, name, label)
  }
}

export default Select