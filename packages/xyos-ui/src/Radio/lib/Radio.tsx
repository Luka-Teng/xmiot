import React from 'react'
import RcCheckbox, { Props as RcCheckBoxProps } from 'rc-checkbox'
import classNames from 'classnames';
import './radio.less'

interface OptionValue {
  label: string
  value: string | number
  disabled?: boolean

}

interface Props extends RcCheckBoxProps {
  label?: string
  CheckboxButton?: boolean
  option?: Array<OptionValue>
}

interface State {
  value: string
}

export default class Radio extends React.Component<Props, State> {

  static defaultProps = {
    prefixCls: 'rc-radio',
    type: 'radio',
  };

  constructor(props: any) {
    super(props);
    let value;
    if ('value' in props) {
      value = props.value;
      console.log(value)
    } else if ('defaultValue' in props) {
      value = props.defaultValue;
    } else {
      const checkedValue = this.getCheckedValue(props.children);
      value = checkedValue && checkedValue.value;
    }
    this.state = {
      value,
    };
  }

  getCheckedValue = (children: React.ReactNode) => {
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



  render() {
    const { className, checked, disabled, option, onChange } = this.props
    const prefixCls = 'rc-radio'
    const wrapperClassString = classNames(className, {
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: checked,
      [`${prefixCls}-wrapper-disabled`]: disabled,
    });

    const Props = { ...this.props }

    if (this.props.onChange) {
      const lastValue = this.state.value
      console.log()

    }

    return (
      <div>
        {
          option && option.map((v, index) => {
            return (
              <label key={index} className={wrapperClassString}>
                <RcCheckbox
                  prefixCls='rc-radio'
                  type='radio'
                  key={`radio-group-value-options-${v.value}`}
                  disabled={v.disabled || this.props.disabled}
                  value={v.value}
                  checked={this.state.value === v.value}
                  ref="checkbox"
                  {...this.props}
                />
                <span>{v.label}</span>
              </label>
            )
          })
        }
      </div>

    )
  }
}
