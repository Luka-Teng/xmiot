import React from 'react'
import PropTypes from 'prop-types';
import RcCheckbox, { Props as RcCheckBoxProps } from 'rc-checkbox'
import classNames from 'classnames';
import { ThemeContext, RadioGroupProps, RadioProps, } from './RadioGroup'
import RadioGroup from './RadioGroup'

type X = Pick<RcCheckBoxProps, Exclude<keyof RcCheckBoxProps, 'onChange'>>;


class Radio extends React.Component<RadioProps> {

  static Group: typeof RadioGroup;

  static defaultProps = {
    prefixCls: 'rc-radio',
    type: 'radio',
  }
  radio!: any
  constructor(props: RadioProps) {
    super(props)
    const value =
      typeof props.value === 'undefined' ? props.value : props.value
    this.state = {
      value
    }
  }
  private rcCheckbox: any;

  saveCheckbox = (node: any) => {
    this.rcCheckbox = node;
  };

  focus() {
    this.rcCheckbox.focus();
  }

  blur() {
    this.rcCheckbox.blur();
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {
          (radioGroup: RadioGroupProps) => {

            const prefixCls = 'rc-radio'
            const { defaultValue, radiobutton, value, } = radioGroup;

            const renderRadio = () => {
              const { props } = this;
              const { className, children, style, ...restProps } = props;
              const radioProps: RadioProps = { ...restProps };
              if (Object.keys(radioGroup).length > 0) {
                radioProps.name = radioGroup.name;
                radioProps.onChange = onChange;
                radioProps.checked = this.props.value === radioGroup.value;
                radioProps.disabled = this.props.disabled || radioGroup.disabled;
              }

              const wrapperClassString = classNames(className, {
                [`${prefixCls}-wrapper`]: true,
                [`${prefixCls}-wrapper-checked`]: radioProps.checked,
                [`${prefixCls}-wrapper-disabled`]: radioProps.disabled,
                [`${prefixCls}-wrapper-button`]: radiobutton
              });

              return (
                <label className={wrapperClassString} >
                  <RcCheckbox
                    prefixCls='rc-radio'
                    type='radio'
                    {...radioProps}
                    ref={this.saveCheckbox}
                  />
                  <span className="rc-radio-text">{children}</span>
                </label>
              )
            }

            const onChange = (e: Event) => {
              if (this.props.onChange) {
                this.props.onChange(e);
              }
              if (radioGroup && radioGroup.onChange) {
                radioGroup.onChange(e);
              }
            };

            return renderRadio()


          }
        }

      </ThemeContext.Consumer>
    )
  }
}

export default Radio