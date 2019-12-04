import React from 'react'
import PropTypes from 'prop-types';
import RcCheckbox, { Props as RcCheckBoxProps } from 'rc-checkbox'
import classNames from 'classnames';
import { ThemeContext, RadioGroupProps } from './RadioGroup'


type X = Pick<RcCheckBoxProps, Exclude<keyof RcCheckBoxProps, 'onChange'>>;

interface Props extends RcCheckBoxProps {
  radiobutton?: boolean
  disabled?: boolean
  value?: string
  radioGroup?: RadioGroupProps
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
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {
          (radioGroup: RadioGroupProps) => {
            const prefixCls = 'rc-radio'
            const { defaultValue, onChange, radiobutton } = radioGroup;
            const { children, disabled } = this.props;
            const optional: optionalType = {};

            if (defaultValue !== undefined) {
              optional.checked = (this.props.value === defaultValue);
            }
            optional.disabled = disabled || radioGroup.disabled;
            if (typeof onChange === 'function') {
              if(this.props.onChange){
               optional.onChange = this.props.onChange.bind( this.props.value);
              }else{
                optional.onChange = onChange.bind(null, this.props.value);
              }
             
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
                  checked={optional.checked}
                  disabled={optional.disabled}
                  onChange={optional.onChange}
                  value={defaultValue}
                />
                <span className="rc-radio-text">{children}</span>
              </label>
            )
          }
        }

      </ThemeContext.Consumer>
    )
  }
}

export default Radio