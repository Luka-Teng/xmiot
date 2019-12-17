import React from 'react'
import classNames from 'classnames';
import Radio from './Radio'

export type CheckboxValueType = string | number | boolean;

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  disabled?: boolean;
  onChange?: (e: Event) => void,
}

export interface AbstractCheckboxProps<T> {
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
  // autoFocus?: boolean;
}
export type RadioProps = AbstractCheckboxProps<any>;


export interface AbstractCheckboxGroupProps {
  prefixCls?: string;
  className?: string;
  options?: Array<CheckboxOptionType | string>;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface RadioGroupProps extends AbstractCheckboxGroupProps {
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
}


// export interface RadioChangeEventTarget extends RadioProps {
//   checked: boolean;
// }

// export interface RadioChangeEvent {
//   target: RadioChangeEventTarget;
//   stopPropagation: () => void;
//   preventDefault: () => void;
//   nativeEvent: MouseEvent;
// }

export interface CheckboxProps extends AbstractCheckboxProps<CheckboxChangeEvent> {
  indeterminate?: boolean;
}


export interface CheckboxChangeEventTarget extends CheckboxProps {
  checked: boolean;
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeEventTarget;
  stopPropagation: () => void;
  preventDefault: () => void;
  nativeEvent: MouseEvent;
}


export const ThemeContext = React.createContext({});

function getCheckedValue(children: React.ReactNode) {
  let value = null;
  let matched = false;
  React.Children.forEach(children, (radio: any) => {
    if (radio && radio.props && radio.props.checked) {
      value = radio.props.value;
      matched = true;
    }
  });
  return matched ? { value } : undefined;
}
export interface RadioGroupState {
  value: any;
}


class RadioGroup extends React.Component<RadioGroupProps, RadioGroupState> {

  static getDerivedStateFromProps(nextProps: RadioGroupProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    const checkedValue = getCheckedValue(nextProps.children);
    if (checkedValue) {
      return {
        value: checkedValue.value,
      };
    }

    return null;
  }


  constructor(props: RadioGroupProps) {
    super(props)
    let value;
    if ('value' in props) {
      value = props.value;
    } else if ('defaultValue' in props) {
      value = props.defaultValue;
    } else {
      const checkedValue = getCheckedValue(props.children);
      value = checkedValue && checkedValue.value;
    }
    this.state = {
      value,
    }
  }


  renderGroup = () => {
    const { props } = this;
    const { className = '', options } = props;
    const prefixCls = 'rc-radio';
    const groupPrefixCls = `${prefixCls}-group`;
    const classString = classNames(
      groupPrefixCls,
      {
        [`${groupPrefixCls}-${props.size}`]: props.size,
      },
      className,
    );
    let { children } = props;
    let { value } = this.state

    // 如果有 option 优先使用配置
    if (options && options.length > 0) {
      children = options.map(option => {
        if (typeof option === 'string') {
          // 此处类型自动推导为 string
          return (
            <Radio
              key={option}
              prefixCls={prefixCls}
              disabled={this.props.disabled}
              value={option}
              checked={this.state.value === option}
            >
              {option}
            </Radio>
          );
        }
        // 此处类型自动推导为 { label: string value: string }
        return (
          <Radio
            key={`radio-group-value-options-${option.value}`}
            prefixCls={prefixCls}
            disabled={option.disabled || this.props.disabled}
            value={option.value}
            checked={value === option.value}
          >
            {option.label}
          </Radio>

        );
      });
    }

    return (
      <ThemeContext.Provider value={this.props}>
        <div
          className={classString}
          style={props.style}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          id={props.id}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    )
  }

  render() {
    return (
      this.renderGroup()
    );
  }
}

export default RadioGroup 