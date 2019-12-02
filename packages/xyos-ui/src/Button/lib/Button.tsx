import React from 'react'
import classnames from 'classnames'

export const tuple = <T extends string[]>(...args: T) => args;

export type ButtonType = 'default' | 'primary' | 'ghost' | 'dashed' | 'danger'
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

}

interface ButtonState {
  loading?: boolean | { delay?: number };
}

class Button extends React.Component<ButtonProps, ButtonState> {

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
    const { className, type, htmlType, size, disabled, loading, icon } = this.props
    const _className = classnames(['button', 'button-' + type, 'button-' + size, className], {
      ['button-disabled']: disabled,
      [`button-loading`]: !!loading,
    })
    const iconNode = loading ? 'loading' : icon;

    return (
      <button className={_className} onClick={this.onClick} type={htmlType}>
        {
          loading && <img className='action-loading' src={require('./loading.gif')} alt="" />
        }
        <span>{children}</span>
      </button>
    )
  }

  private onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onClick, disabled, loading } = this.props
    if (onClick) {
      if (!disabled && !loading) {
        onClick(event)
      }
    }
  }

}

export default Button

