import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from './Checkbox';

export type CheckboxValueType = string | number | boolean;

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  disabled?: boolean;
  onChange?: (e: Event) => void;
}

export interface CheckboxGroupState {
  value: CheckboxValueType[];
  registeredValues: CheckboxValueType[];
}

export interface CheckboxGroupContext {
  checkboxGroup: {
    toggleOption: (option: CheckboxOptionType) => void;
    value: any;
    disabled: boolean;
  };
}

interface CheckboxGroupProps {
  options?: Array<CheckboxOptionType | string>;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

class CheckboxGroup extends React.Component<CheckboxGroupProps, CheckboxGroupState> {

  static defaultProps = {
    options: [],
  };

  // context  中字段设置类型检查
  static childContextTypes = {
    checkboxGroup: PropTypes.object,
  };

  static propTypes = {
    onChange: PropTypes.func,
    defaultValue: PropTypes.array,
    value: PropTypes.array,
    options: PropTypes.array.isRequired,
  }

  constructor(props: CheckboxGroupProps) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      registeredValues: [],
    };
  }

  getChildContext() {
    return {
      checkboxGroup: {
        toggleOption: this.toggleOption,
        value: this.state.value,
        disabled: this.props.disabled,
        registerValue: this.registerValue,
        cancelValue: this.cancelValue,
      },
    };
  }

  toggleOption = (option: CheckboxOptionType) => {
    const { registeredValues } = this.state;
    const optionIndex = this.state.value.indexOf(option.value);
    const value = [...this.state.value];
    if (optionIndex === -1) {
      value.push(option.value);
    } else {
      value.splice(optionIndex, 1);
    }
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    const { onChange } = this.props;
    if (onChange) {
      const options = this.getOptions();
      onChange(
        value
          .filter(val => registeredValues.indexOf(val) !== -1)
          .sort((a, b) => {
            const indexA = options.findIndex(opt => opt.value === a);
            const indexB = options.findIndex(opt => opt.value === b);
            return indexA - indexB;
          }),
      );
    }
  }

  registerValue = (value: string) => {
    this.setState(({ registeredValues }) => ({
      registeredValues: [...registeredValues, value],
    }));
  };

  cancelValue = (value: string) => {
    this.setState(({ registeredValues }) => ({
      registeredValues: registeredValues.filter(val => val !== value),
    }));
  };

  getOptions() {
    const { options } = this.props;
    return (options as Array<CheckboxOptionType>).map(option => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        } as CheckboxOptionType;
      }
      return option;
    });
  }

  render() {
    const { props, state } = this;
    const { className, style, options, ...restProps } = props;
    const prefixCls = 'checkbox';
    const groupPrefixCls = `${prefixCls}-group`;
    let { children } = props;

    if (options && options.length > 0) {
      children = this.getOptions().map(option => (
        <Checkbox
          prefixCls={prefixCls}
          key={option.value.toString()}
          disabled={'disabled' in option ? option.disabled : props.disabled}
          value={option.value}
          checked={state.value.indexOf(option.value) !== -1}
          onChange={option.onChange}
          className={`${groupPrefixCls}-wrapper`}
        >
          {option.label}
        </Checkbox>
      ));
    }
    const classString = classNames(groupPrefixCls, className);
    return (
      <div className={classString} style={style} >
        {children}
      </div>
    );

  }
}

export default CheckboxGroup 