import * as React from 'react'

export interface IconProps {
  tabIndex?: number;
  type?: string;
  className?: string;
  title?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  twoToneColor?: string;
  viewBox?: string;
  spin?: boolean;
  rotate?: number;
  style?: React.CSSProperties;
  prefixCls?: string;
  role?: string;
}

class Icon extends React.Component<IconProps>{

  render () {
    return (
      <span onClick={this.props.onClick} style={{color: 'red'}}>X</span>
    )
  }
}

export default Icon