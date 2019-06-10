import React, { PureComponent } from 'react'
import { Select as AntSelect } from 'antd'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

const AntOption = AntSelect.Option

class Select extends PureComponent<FormItemProps<'select'>> {
  render() {
    const {
      name,
      label,
      props,
      styles,
      /* 由于config可以为undefined，所以必须加上初始值 */
      config = {
        data: []
      },
      form: { getFieldDecorator }
    } = this.props

    const {
      initialValue = null,
      rules = [],
      multi = false,
      onSelectChange,
      data,
      appendElement,
      insertElement
    } = config

    return wrapField(
      getFieldDecorator(name, {
        initialValue: initialValue || (multi ? [] : ''),
        rules
      })(
        <AntSelect
          onChange={onSelectChange}
          placeholder={label}
          {...props}
          mode={multi ? 'multiple' : ''}
        >
          {data.map(d => (
            <AntOption key={d.name} value={d.value}>
              {d.name}
            </AntOption>
          ))}
        </AntSelect>
      ),
      { ...styles, appendElement, insertElement },
      name,
      label
    )
  }
}

export default Select
