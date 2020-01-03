import React, { Component } from 'react'
import createFromIconfontCN from './IconFont';
import classNames from 'classnames'
import './icon.less'

function omit(obj: any, fields: Array<string>) {
  const shallowCopy = {
    ...obj,
  };
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i];
    delete shallowCopy[key];
  }
  return shallowCopy;
}

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

export type ThemeType = 'filled' | 'outlined' | 'twoTone';

export interface IconComponent<P> extends React.SFC<P> {
  createFromIconfontCN: typeof createFromIconfontCN;
}

export const svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: 'false',
};

const Icon: IconComponent<IconProps> = props => {

  const { 
    type, className = '', 
    spin, 
    component: Component,
    children, 
    rotate, 
    viewBox,
    theme
  } = props;

  const svgClassString = classNames({
    [`anticon-spin`]: !!spin || type === 'loading',
  });

  const svgStyle = rotate
    ? {
      msTransform: `rotate(${rotate}deg)`,
      transform: `rotate(${rotate}deg)`,
    }
    : undefined;

  const innerSvgProps: CustomIconComponentProps = {
    ...svgBaseProps,
    className: svgClassString,
    style: svgStyle,
    viewBox,
  };
  const classString = classNames({
    'xyos-icon': true,
    'xyos-icon-spin': !!spin || type === 'loading',
    [`xyos-icon-${type}`]: theme ?'' : true,
    [`xyos-icon-${theme}-${type}`]:true
  }, className);

  const renderInnerNode = () => {
    // component > children > type
    if (Component) {
      return <Component {...innerSvgProps}>{children}</Component>;
    }

    if (children) {
      return (
        <svg {...innerSvgProps} viewBox={viewBox}>
          {children}
        </svg>
      );
    }

    if (typeof type === 'string') {
      let computedType = type;
      if (theme) {
        // const themeInName = getThemeFromTypeName(type);
    
      }
      // computedType = withThemeSuffix(
      //   removeTypeTheme(alias(computedType)),
      //   dangerousTheme || theme || defaultTheme,
      // );
      return (
        <i></i>
        // <ReactIcon
        //   className={svgClassString}
        //   type={computedType}
        //   primaryColor={twoToneColor}
        //   style={svgStyle}
        // />
      );
    }
  };


    return <i {...omit(props, ['type', 'spin'])} className={classString} > </i>;
  };

  Icon.createFromIconfontCN = createFromIconfontCN;

  export default Icon