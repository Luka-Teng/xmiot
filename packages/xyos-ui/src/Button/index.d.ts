import * as React from 'react'

type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'danger'
type ButtonHtmlType = 'submit' | 'button' | 'reset'
type ButtonSize = 'medium' | 'large' | 'small'

export interface ButtonProps {
  type?: ButtonType;
  icon?: string;
  size?: ButtonSize;
  loading?: boolean | { delay?: number };
  disabled?: boolean
  className?: string;
  block?: boolean;
  htmlType?: ButtonHtmlType
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  ghost?:boolean
}


declare class Button extends React.Component<ButtonProps> {}

export default Button
