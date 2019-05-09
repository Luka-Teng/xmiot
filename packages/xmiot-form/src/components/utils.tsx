import React from 'react'
import { Form as AntForm } from 'antd'
import { Col as AntCol } from 'antd'

import { FormStyles } from '../types'

type WrapFieldOptions = FormStyles & {
  insertElement?: React.ReactNode
  appendElement?: React.ReactNode
}

export const wrapField = (
  element: React.ReactNode,
  options: WrapFieldOptions = {},
  name: string,
  label?: string
): React.ReactNode => {
  const {
    display = '1/3',
    labelStyle,
    itemStyle,
    insertElement,
    appendElement
  } = options
  const wrapper = (spanNum: number) => (
    <AntCol span={spanNum} key={name}>
      <AntForm.Item
        labelCol={{ style: { ...labelStyle } }}
        wrapperCol={{ style: { ...itemStyle } }}
        label={label}
      >
        <div>
          {insertElement}
          {element}
          {appendElement}
        </div>
      </AntForm.Item>
    </AntCol>
  )

  const strategies: {
    [key in NonNullable<WrapFieldOptions['display']>]: React.ReactNode
  } = {
    '1/1': wrapper(24),
    '1/2': wrapper(12),
    '1/3': wrapper(8),
    '1/4': wrapper(6)
  }

  return strategies[display]
}
