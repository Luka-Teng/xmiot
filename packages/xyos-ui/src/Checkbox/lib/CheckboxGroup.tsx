import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from './Checkbox';

export type CheckboxValueType = string | number | boolean;
export const ThemeContext = React.createContext({});
export interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  disabled?: boolean;
  onChange?: (e: Event, ) => void;
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
  onChange?: (e: Event, checkedValue: Array<CheckboxValueType>) => void;
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

class CheckboxGroup extends React.Component<CheckboxGroupProps, CheckboxGroupState> {
  private rcCheckboxGroup: any;

  static defaultProps = {
    options: [],
  };

  static getDerivedStateFromProps (nextProps: CheckboxGroupProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value
      }
    }
    return null
  }


  constructor(props: CheckboxGroupProps) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      registeredValues: [],
    };
  }
  saveCheckboxGroup = (node: any) => {
    this.rcCheckboxGroup = node;
  };

  ProviderValue() {
    const { value } = this.state
    if('value' in this.props){
      if(!(value instanceof Array)){
        throw new Error('参数错误')
      }
    }
  
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

  toggleOption = (e: any, option: CheckboxOptionType) => {
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
      const params = value.filter(val => registeredValues.indexOf(val) !== -1).sort((a, b) => {
        const indexA = options.findIndex(opt => opt.value === a);
        const indexB = options.findIndex(opt => opt.value === b);
        return indexA - indexB;
      })
      this.setState({
        value: params
      })
      let event = e
      event.target = this.rcCheckboxGroup;
      event.target.value = params
      onChange(event, params);
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
      <div className={classString} style={style} ref={this.saveCheckboxGroup}>
        <ThemeContext.Provider value={this.ProviderValue()}>
          {children}
        </ThemeContext.Provider>
      </div>
    );
  }
}

export default CheckboxGroup 