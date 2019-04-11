import { ButtonProps as AntdButtonProps } from 'antd/lib/button'
import { FormComponentProps, ValidationRule } from 'antd/lib/form'
import { RefObject, ReactElement, CSSProperties } from 'react'

/*-----FORM-----*/
/**
 * Button
 * 按钮的基础类型
 * @prop { doubleCheck } 按钮是否需要二次确认
 * @prop { name } 按钮名字
 * @prop { props } 按钮基础属性
 */
type ButtonProps = {
  doubleCheck?: boolean
  name?: string
  props?: AntdButtonProps
}

/**
 * ExtraButton
 * @prop { cb } 按钮点击后的回调
 */
type ExtraButtonProps = ButtonProps & {
  cb: Function
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
 */
export type Config = {
  InputConfig: BasicConfig
  SelectConfig: BasicConfig & {
    data: {
      name: string
      value: string | number
    }[]
    multi?: boolean
    onSelectChange?: (value: any) => void
  }
}

/*
 * FormItemTypes
 * 可支持的表单组件类型
 */
type FormItemTypes = 'input' | 'select'

/*
 * ItemType mapping to Config
 * 根据表单组件类型获取对应的config
 */
type ItemTypeToConfig<T extends FormItemTypes> = T extends 'input'
  ? Config['InputConfig']
  : T extends 'select'
  ? Config['SelectConfig']
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
