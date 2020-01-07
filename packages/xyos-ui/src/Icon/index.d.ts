import * as React from 'react'

type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'danger'
type ButtonHtmlType = 'submit' | 'button' | 'reset'
type ButtonSize = 'medium' | 'large' | 'small'

export type ThemeType = 'filled' | 'outlined' | 'twoTone' | null;

export interface CustomIconComponentProps {
  width: string | number;
  height: string | number;
  fill: string;
  viewBox?: string;
  className?: string;
  style?: React.CSSProperties;
  spin?: boolean;
  rotate?: number;
  ['aria-hidden']?: React.AriaAttributes['aria-hidden'];
}

export interface IconProps {
  type?: string
  className?: string
  theme?: ThemeType;
  onClick?: React.MouseEventHandler<any>;
  spin?: boolean;
  style?: React.CSSProperties;
  viewBox?: string
  rotate?: number
  component?: React.ComponentType<CustomIconComponentProps | React.SVGProps<SVGSVGElement>>;

}


declare class Icon extends React.Component<IconProps> {}

export default Icon
