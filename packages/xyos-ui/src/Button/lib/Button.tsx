import React from 'react'
import classnames from 'classnames'
import loadingGif from './loading.gif'

export const tuple = <T extends string[]>(...args: T) => args;
export const omit = (
  source: { [propName: string]: any },
  target: string[]
): object => {
  let tempSource = { ...source }
  target.map(item => delete tempSource[item])
  return tempSource
}

export type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'danger'
// type ButtonHtmlType = 'submit' | 'button' | 'reset'
type ButtonSize = 'medium' | 'large' | 'small'

const ButtonHTMLTypes = tuple('submit', 'button', 'reset');

export type ButtonHTMLType = typeof ButtonHTMLTypes[number];

export interface BaseButtonProps {
  type?: ButtonType;
  icon?: string;
  size?: ButtonSize;
  loading?: boolean | { delay?: number };
  disabled?: boolean
  className?: string;
  block?: boolean;
  children?: React.ReactNode;
}

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

  export type AnchorButtonProps = {
    href: string;
    target?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
  } & BaseButtonProps &
    Omit<React.AnchorHTMLAttributes<any>, 'type' | 'onClick'>;

export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>;


interface ButtonState {
  loading?: boolean | { delay?: number };
}

class Button extends React.Component<ButtonProps, ButtonState> {

  static __XYOS_BUTTON = true;

  static defaultProps = {
    type: 'default',
    loading: false,
    ghost: false,
    block: false,
    htmlType: 'button',
  };

  constructor(props: ButtonProps) {
    super(props)
    this.state = {
      loading: props.loading,
    };
  }

  render() {
    const { children } = this.props
    const { className, type, size, disabled, loading, icon, ...rest } = this.props
    const _className = classnames(['button', 'button-' + type, 'button-' + size, className], {
      ['button-disabled']: disabled,
      [`button-loading`]: !!loading,
    })
    const iconNode = loading ? 'loading' : icon;
    const { htmlType, ...otherProps } = rest as NativeButtonProps;
    return (
      <button 
      {...(omit(otherProps, ['loading']) as NativeButtonProps)}
      className={_className} 
      onClick={this.onClick} 
      type={htmlType}>
        {
          loading && <img className='action-loading' src={loadingGif} alt="" />
        }
        <span>{children}</span>
      </button>
    )
  }

  private onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onClick, disabled, loading } = this.props
    if(loading){
      return
    }
    if(disabled){
      return
    }
    if (onClick) {
      (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(event);
    }
  }

}

export default Button

