import React, { PureComponent } from 'react'
import { Radio } from 'antd'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

const AntRadioGroup = Radio.Group

class RadioGroup extends PureComponent<FormItemProps<'radioGroup'>> {
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

    const { initialValue = '', rules = [], onChange, data, appendElement, insertElement } = config

    return wrapField(
      getFieldDecorator(name, {
        initialValue,
        rules
      })(
        <AntRadioGroup onChange={onChange} {...props}>
          {data.map((d, i) => {
            return (
              <div key={i} style={_styles.divStyle}>
                {d.insertElement}
                <Radio value={d.value}>{d.label}</Radio>
                {d.appendElement}
              </div>
            )
          })}
        </AntRadioGroup>
      ),
      { ...styles, appendElement, insertElement },
      name,
      label
    )
  }
}

const _styles = {
  divStyle: {
    paddingRight: '15px'
  }
}

export default RadioGroup
