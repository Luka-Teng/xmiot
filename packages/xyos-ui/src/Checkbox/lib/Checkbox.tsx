import React from 'react'
import RcCheckBox, { Props as RcCheckBoxProps } from 'rc-checkbox'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './checkbox.less'

type X = Pick<RcCheckBoxProps, Exclude<keyof RcCheckBoxProps, 'onChange'>>;

interface CheckboxProps extends X {
  label?: string
  radiobutton?: boolean
  disabled?: boolean
  value?: any
  onChange?: (e: Event) => void,
}

class Checkbox extends React.Component<CheckboxProps> {

  public static defaultProps: Readonly<Partial<CheckboxProps>> = {
    defaultChecked: false,
  }

  public readonly state = {
    checked: false,
  }

  // 类型检查
  static contextTypes = {
    checkboxGroup: PropTypes.any,
  };

  public checked = 'checked' in this.props ? this.props.checked : this.props.defaultChecked;

  context: any;

  private rcCheckbox: any;

  componentDidMount() {
    const { value } = this.props;
    const { checkboxGroup = {} } = this.context || {};
    if (checkboxGroup.registerValue) {
      checkboxGroup.registerValue(value);
    }
  }
  componentDidUpdate({ value: prevValue }: CheckboxProps) {
    const { value } = this.props;
    const { checkboxGroup = {} } = this.context || {};
    if (value !== prevValue && checkboxGroup.registerValue && checkboxGroup.cancelValue) {
      checkboxGroup.cancelValue(prevValue);
      checkboxGroup.registerValue(value);
    }
  }
  componentWillUnmount() {
    const { value } = this.props;
    const { checkboxGroup = {} } = this.context || {};
    if (checkboxGroup.cancelValue) {
      checkboxGroup.cancelValue(value);
    }
  }
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
    const { props, context } = this;
    const {
      className,
      children,
      style,
      ...restProps
    } = props;
    const { checkboxGroup } = context;
    const prefixCls = 'rc-checkbox';
    const checkboxProps: CheckboxProps = { ...restProps };

    // console.log(props,'props')
    // console.log(context,'context')
    // console.log(checkboxGroup,'checkboxGroup')

    if (checkboxGroup) {
      checkboxProps.onChange = (...args) => {
        console.log(restProps, '9999')
        if (restProps.onChange) {
          restProps.onChange(...args);
        }
        checkboxGroup.toggleOption({ label: children, value: props.value });
      };
      checkboxProps.name = checkboxGroup.name;
      checkboxProps.checked = checkboxGroup.value.indexOf(props.value) !== -1;
      checkboxProps.disabled = props.disabled || checkboxGroup.disabled;
    }
    const classString = classNames(className, {
      [`${prefixCls}-wrapper`]: true,
      [`${prefixCls}-wrapper-checked`]: checkboxProps.checked,
      [`${prefixCls}-wrapper-disabled`]: checkboxProps.disabled,
    });

    return (
      <label
        className={classString}
        style={style}
      >
        <RcCheckBox
          {...checkboxProps}
          prefixCls={prefixCls}
          ref={this.saveCheckbox}
        />
        {children !== undefined && <span>{children}</span>}
      </label>
    );
  }
}

export default Checkbox