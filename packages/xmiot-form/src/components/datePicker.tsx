import React, { PureComponent } from 'react'
import { DatePicker as AntDatePicker } from 'antd'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

const AntRangePicker = AntDatePicker.RangePicker

class DatePicker extends PureComponent<FormItemProps<'datePicker'>> {
  render() {
    const {
      name,
      label,
      props,
      styles,
      /* 由于config可以为undefined，所以必须加上初始值 */
      config = {},
      form: { getFieldDecorator }
    } = this.props

    const { initialValue, rules = [], range = false, onChange } = config

    return wrapField(
      getFieldDecorator(name, {
        initialValue,
        rules
      })(
        range ? (
          <AntRangePicker onChange={onChange} {...props} />
        ) : (
          <AntDatePicker onChange={onChange} {...props} />
        )
      ),
      styles,
      name,
      label
    )
  }
}

export default DatePicker
