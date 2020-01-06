import React from 'react'
import { RuleItem } from 'async-validator'

declare class Form extends React.Component<{}> {
  getFieldValue: (name: string) => any
  getFieldsValue: (names: string[]) => any[]
  setFieldValue: (name: string, value: any) => void
  setFieldsValue: (fields: { [x: string]: any }) => void
  validateField: (name: string, callback?: Function) => void
  validateFields: ((names: string[], callback?: Function | undefined) => void) 
    & ((callback?: Function | undefined) => void)
  validateFieldsToScroll: ((
    names: string[],
    callback?: Function | undefined
  ) => void) & ((callback?: Function | undefined) => void)
  resetFieldValue: (name: string) => void
  resetFieldsValue: (names?: string[]) => void
}

type FormItemProps = {
  name: string
  initialValue?: any
  validates?: RuleItem[]
  valuePropName?: string
  trigger?: string
  triggerValidate?: string
  errorComponent?: React.ComponentClass<any, any> | React.FunctionComponent<any>
} & Partial<JSX.IntrinsicElements['div']>

declare class FormItem extends React.Component<FormItemProps> { }

declare const createForm: () => [typeof Form, typeof FormItem]

declare const createFormRef: () => React.RefObject<Form>

export {
  createForm,
  createFormRef
}