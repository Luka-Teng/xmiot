import React from 'react'
import PropTypes from 'prop-types';
import RcCheckbox, { Props as RcCheckBoxProps } from 'rc-checkbox'
import classNames from 'classnames';

interface OptionValue {
  label: string
  value: string | number
  disabled?: boolean
}

type X = Pick<RcCheckBoxProps, Exclude<keyof RcCheckBoxProps, 'onChange'>>;

interface Props extends X {
  label?: string
  radiobutton?: boolean
  option?: Array<OptionValue>
  disabled?: boolean
  value?: string
  optional?: optionalType
  onChange?: (e: Event) => void,
}

interface optionalType {
  checked?: boolean
  disabled?: boolean
  onChange?: (e: Event) => void,
}

class Radio extends React.Component<Props> {

  static defaultProps = {
    prefixCls: 'rc-radio',
    type: 'radio',
  };

  static contextTypes = {
    radioGroup: PropTypes.object
  }

  render() {
    const prefixCls = 'rc-radio'
    const { defaultValue, onChange, radiobutton } = this.context.radioGroup;
    const { children, disabled } = this.props;
    const optional: optionalType = {};
    
    if (defaultValue !== undefined) {
      optional.checked = (this.props.value === defaultValue);
    }
    // if (disabled !== undefined) {
    //   optional.disabled = disabled|| this.context.radioGroup.disabled ;
    // }
    optional.disabled = disabled || this.context.radioGroup.disabled;
    if (typeof onChange === 'function') {
      optional.onChange = onChange.bind(null, this.props.value);
    }

    const wrapperClassString = classNames({
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: optional.checked,
      [`${prefixCls}-wrapper-disabled`]: optional.disabled,
      [`${prefixCls}-wrapper-button`]: radiobutton
    });

    return (
      <label className={wrapperClassString} >
        <RcCheckbox
          prefixCls='rc-radio'
          type='radio'
          ref="checkbox"
          checked={optional.checked}
          disabled={optional.disabled}
          onChange={optional.onChange}
          value={defaultValue}
        />
        <span>{children}</span>
      </label>
    )
  }
}

export default Radio