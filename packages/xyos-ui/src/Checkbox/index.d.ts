
  import React from 'react'
  import RcCheckBox, { Props as RcCheckBoxProps } from 'rc-checkbox'

  export type CheckboxValueType = string | number | boolean
  type X = Pick<RcCheckBoxProps, Exclude<keyof RcCheckBoxProps, 'onChange'>>;
  export interface CheckboxOptionType {
    label: React.ReactNode
    value: CheckboxValueType
    disabled?: boolean
    onChange?: (e: Event) => void
  }

  export interface CheckboxProps extends X {
    radiobutton?: boolean
    disabled?: boolean
    value?: any
    onChange?: (e: Event) => void,
  }

  interface CheckboxGroupProps {
    options?: Array<CheckboxOptionType | string>;
    onChange?: (e: Event, checkedValue: Array<CheckboxValueType>) => void;
    defaultValue?: Array<CheckboxValueType>;
    value?: Array<CheckboxValueType>;
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }
  
  
  declare class CheckboxGroup extends React.Component<CheckboxGroupProps> {}
  declare class Checkbox extends React.Component<CheckboxProps> {}
 
  export  {
    Checkbox,
    CheckboxGroup
  }
