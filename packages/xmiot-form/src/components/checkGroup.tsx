import React, { PureComponent } from 'react'
import { Checkbox as AntCheckbox, Row as AntRow, Divider } from 'antd'

import { FormItemProps } from '../types'
import { wrapField } from './utils'

const AntCheckboxGroup = AntCheckbox.Group

class CheckGroup extends PureComponent<FormItemProps<'checkGroup'>> {
  checkAll = (e: any) => {
    const { name, config = { data: [] } } = this.props
    const { data, onChange } = config
    const values = e.target.checked ? data.map(e => e.value) : []
    onChange && onChange(values)
    const setFieldsValue = this.props.form.setFieldsValue
    setFieldsValue({
      [name]: values
    })
  }

  render () {
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
      initialValue = [],
      rules = [],
      onChange,
      data,
      checkAllBtn = false
    } = config

    const composedStyles = Object.assign({}, _styles, styles)

    return wrapField(
      getFieldDecorator(name, {
        initialValue,
        rules
      })(<AntCheckboxGroup options={data} {...props} onChange={onChange} />),
      {
        insertElement: checkAllBtn ? (
          <AntRow style={{ lineHeight: 'normal' }}>
            <AntCheckbox onChange={this.checkAll}>全选</AntCheckbox>
            <Divider style={{ margin: '10px 0px' }} />
          </AntRow>
        ) : null,
        ...composedStyles
      },
      name,
      label
    )
  }
}

const _styles = {
  itemStyle: {
    display: 'flex',
    alignItems: 'center'
  }
}

export default CheckGroup
