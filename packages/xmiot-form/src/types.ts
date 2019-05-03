import { ButtonProps as AntdButtonProps } from 'antd/lib/button'
import { FormComponentProps, ValidationRule } from 'antd/lib/form'
import { RefObject, ReactElement, CSSProperties } from 'react'

/*-----FORM-----*/
/**
 * Button
 * 按钮的基础类型
 * @prop { confirm } 按钮是否需要二次确认
 * @prop { name } 按钮名字
 * @prop { props } 按钮基础属性
 * @prop { styles } 按钮样式
 */
type ButtonProps = {
  confirm?: string
  name?: string
  props?: AntdButtonProps
  styles?: FormStyles
}

/**
 * ExtraButton
 * @prop { cb } 按钮点击后的回调
 */
type ExtraButtonProps = ButtonProps & {
  cb: (e?: React.MouseEvent<any>) => void
}

/**
 * styles
 * 可重构的样式类型
 * @prop { labelStyle } 组件label的样式
 * @prop { itemStyle } 组件item的样式
 * @prop { display } 组件的横向占比
 */
export type FormStyles = {
  labelStyle?: CSSProperties
  itemStyle?: CSSProperties
  display?: '1/4' | '1/3' | '1/2' | '1/1'
}

/* 基础config配置 */
type BasicConfig<T = any> = {
  rules?: ValidationRule[]
  initialValue?: T
}

/**
 * 所有组件的config类型
 * @prop { InputConfig } input组件
 * @prop { SelectConfig } select组件
 * @prop { TextareaConfig } textarea组件
 * @prop { DatePicker } datePicker组件
 * @prop { CheckGroup } checkGroup组件
 * @prop { Upload } Upload组件
 * @prop { RadioGroup } RadioGroup组件
 * @prop { ColorPicker } ColorPicker组件
 * @prop { Button } Button组件
 */
export type Config = {
  InputConfig: BasicConfig & {
    onChange?: (value: any) => void
  }
  TextareaConfig: BasicConfig & {
    rows?: number
    resize?: boolean
    onChange?: (value: any) => void
    onPressEnter?: (value: any) => void
  }
  SelectConfig: BasicConfig & {
    data: {
      name: string
      value: string | number
    }[]
    multi?: boolean
    onSelectChange?: (value: any) => void
  }
  DatePickerConfig: BasicConfig & {
    range?: boolean
    onChange?: (data: any, dataString: any) => void
  }
  CheckGroupConfig: BasicConfig<Array<string | number>> & {
    data: {
      label: string
      value: string | number
    }[]
    onChange?: (value: any) => void
    checkAllBtn?: boolean
  }
  UploadConfig: BasicConfig<Array<string>> & {
    maxNumber?: number
    onUpload?: Function
    maxSize?: number // kb
    /* 文件类型或image video */
    accept?: Array<string> | 'image' | 'video'
  }
  RadioGroupConfig: BasicConfig<string | number> & {
    data: {
      label: string
      value: string | number
      insertElement?: React.ReactNode
      appendElement?: React.ReactNode
    }[]
    onChange?: (value: any) => void
  }
  ColorPickerConfig: BasicConfig<string>
  ButtonConfig: BasicConfig & {
    cb: (e?: React.MouseEvent<any>) => void
    confirm?: string
  }
}

/*
 * FormItemTypes
 * 可支持的表单组件类型
 */
type FormItemTypes =
  | 'input'
  | 'select'
  | 'textarea'
  | 'datePicker'
  | 'checkGroup'
  | 'upload'
  | 'radioGroup'
  | 'colorPicker'
  | 'button'

/*
 * ItemType mapping to Config
 * 根据表单组件类型获取对应的config
 */
type ItemTypeToConfig<T extends FormItemTypes> = T extends 'input'
  ? Config['InputConfig']
  : T extends 'select'
  ? Config['SelectConfig']
  : T extends 'textarea'
  ? Config['TextareaConfig']
  : T extends 'datePicker'
  ? Config['DatePickerConfig']
  : T extends 'checkGroup'
  ? Config['CheckGroupConfig']
  : T extends 'upload'
  ? Config['UploadConfig']
  : T extends 'radioGroup'
  ? Config['RadioGroupConfig']
  : T extends 'colorPicker'
  ? Config['ColorPickerConfig']
  : T extends 'button'
  ? Config['ButtonConfig']
  : never

/**
 * option
 * 表单组件基础配置
 * @prop { type } 组件类型
 * @prop { name } 组件名称
 * @prop { label } 组件label名
 * @prop { props } 组件内部元素基础属性
 * @prop { styles } 组件样式
 */
export type FormItem<T extends FormItemTypes> = {
  type: T
  name: string
  label?: string
  props?: genObject
  styles?: FormStyles
  config?: ItemTypeToConfig<T>
}

/**
 * FormItemTypes to FormItems
 * 获取所有表单组件配置的联合类型
 */
type ItemTypesToFormItems<T> = T extends any ? FormItem<T> : never

/**
 * Form
 * 表单的Props
 * @prop { options } 组件配置列表
 * @prop { onSubmit } 表单提交事件
 * @prop { confirmButton } 提交按钮配置
 * @prop { extranButtons } 额外按钮配置
 * @prop { formRef } 表单组件实例
 * @prop { styles } 表单组件全局样式
 */
export interface FormProps extends FormComponentProps {
  options: ItemTypesToFormItems<FormItemTypes>[]
  onSubmit: (values: genObject) => void
  confirmButton?: ButtonProps
  extranButtons?: ExtraButtonProps[]
  formRef?: RefObject<{}>
  styles?: FormStyles
}

/*-----COMPONENT-----*/
/**
 * FormItemProps
 * 表单组件需要的类型
 * 除了表单基础配置还需要额外的config配置和form属性
 */
export type FormItemProps<T extends FormItemTypes> = Pick<
  FormItem<T>,
  'name' | 'label' | 'props' | 'styles' | 'config'
> &
  FormComponentProps

/*-----FIELDS-----*/
/**
 * FieldsProps
 * Fields组件的props
 */
export type FieldsProps = Pick<FormProps, 'options' | 'styles'> &
  FormComponentProps
