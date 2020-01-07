
  import React from 'react'
  export type CheckboxValueType = string | number | boolean

  export interface CheckboxOptionType {
    label: React.ReactNode
    value: CheckboxValueType
    disabled?: boolean
    onChange?: (e: Event) => void
  }

  type RadioGroupProps = {
    radiobutton?: boolean
    name?: string
    defaultValue?: string
    disabled?: boolean
    style?: React.CSSProperties;
    className?: string;
    value?: any;
    onChange?: (e: Event) => void,
    size?: 'large' | 'default' | 'small';
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    children?: React.ReactNode;
    id?: string;
    prefixCls?: string;
    options?: Array<CheckboxOptionType | string>;
  }

  type RadioProps  = {
    prefixCls?: string;
    className?: string;
    defaultChecked?: boolean;
    checked?: boolean;
    style?: React.CSSProperties;
    disabled?: boolean;
    onChange?: (e: T) => void;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
    onKeyPress?: React.KeyboardEventHandler<HTMLElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
    value?: any;
    tabIndex?: number;
    name?: string;
    children?: React.ReactNode;
    id?: string;
  }

  declare class Radio extends React.Component<RadioProps> {
    static Group(Props:RadioGroupProps);
   }
  
 
  export default Radio
