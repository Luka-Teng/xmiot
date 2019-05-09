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
    display = 8,
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

  return wrapper(display)
}
