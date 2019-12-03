// import React from "react";

// type Event = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

// export interface Props {
//   value?: string;
//   onChange?: (e: Event) => void;
//   defaultValue?: string;
// }

// export interface State {
//   value: any
// }

// function fixControlledValue<T>(value: T) {
//   if (typeof value === 'undefined' || value === null) {
//     return '';
//   }
//   return value;
// }

// class Input extends React.Component<Props, State> {
//   static getDerivedStateFromProps(nextProps: Props) {
//     if ("value" in nextProps) {
//       console.log(nextProps.value);
//       return {
//         value: nextProps.value
//       };
//     }
//     return null;
//   }
//   constructor(props: Props) {
//     super(props);
//     const value = typeof props.value === "undefined" ? props.defaultValue : props.value;
//     this.state = {
//       value
//     };
//   }

//   setValue(value: string, e: Event) {
//     if (!("value" in this.props)) {
//       this.setState({ value });
//     }
//     const { onChange } = this.props;
//     if (onChange) {
//       onChange(e);
//     }
//   }

//   handleChange = (e: Event): void =>{
//     this.setValue(e.target && e.target.value, e);
//   };

//   render() {
//     return (
//       <div>
//         <input
//           onChange={this.handleChange}
//           value={fixControlledValue(this.state.value)}
//           type="text"
//         />
//       </div>
//     );
//   }
// }

// export default Input

  
import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import ClearableLabeledInput, { hasPrefixSuffix } from './ClearableInput';
import './Input.less'

import { tuple, Omit } from '../type'
const omit = (source: {[propName: string]: any}, target: string[]):object => {
  let tempSource = {...source}
  target.map((item) => delete tempSource[item])
  return tempSource
}
export const InputSizes = tuple('small', 'default', 'large');

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement|HTMLTextAreaElement>, 'size' | 'prefix'> {
  prefixCls?: string;
  size?: (typeof InputSizes)[number];
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement|HTMLTextAreaElement>;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
}

export function fixControlledValue<T>(value: T) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return value;
}

export function resolveOnChange(
  target: HTMLInputElement | HTMLTextAreaElement,
  e:
    | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>,
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
) {
  if (onChange) {
    let event = e;
    if (e.type === 'click') {
      // click clear icon
      event = Object.create(e);
      event.target = target;
      event.currentTarget = target;
      const originalInputValue = target.value;
      // change target ref value cause e.target.value should be '' when clear input
      target.value = '';
      onChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
      // reset target ref value
      target.value = originalInputValue;
      return;
    }
    onChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
  }
}

export function getInputClassName(
  prefixCls?: string,
  size?: (typeof InputSizes)[number],
  disabled?: boolean,
) {
  return classNames(prefixCls, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-disabled`]: disabled,
  });
}

export interface InputState {
  value: any;
}

class Input extends React.Component<InputProps, InputState> {
  // static Group: typeof Group;

  // static Search: typeof Search;

  // static TextArea: typeof TextArea;

  // static Password: typeof Password;

  static defaultProps = {
    type: 'text',
  };

  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    size: PropTypes.oneOf(InputSizes),
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    value: PropTypes.any,
    defaultValue: PropTypes.any,
    className: PropTypes.string,
    addonBefore: PropTypes.node,
    addonAfter: PropTypes.node,
    prefixCls: PropTypes.string,
    onPressEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    prefix: PropTypes.node,
    suffix: PropTypes.node,
    allowClear: PropTypes.bool,
  };

  input!: HTMLInputElement;


  constructor(props: InputProps) {
    super(props);
    const value = typeof props.value === 'undefined' ? props.defaultValue : props.value;
    this.state = {
      value,
    };
  }

  static getDerivedStateFromProps(nextProps: InputProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  // Since polyfill `getSnapshotBeforeUpdate` need work with `componentDidUpdate`.
  // We keep an empty function here.
  componentDidUpdate() {}

  getSnapshotBeforeUpdate(prevProps: InputProps) {
    if (hasPrefixSuffix(prevProps) !== hasPrefixSuffix(this.props)) {
      // warning(
      //   this.input !== document.activeElement,
      //   'Input',
      //   `When Input is focused, dynamic add or remove prefix / suffix will make it lose focus caused by dom structure change. Read more: https://ant.design/components/input/#FAQ`,
      // );
    }
    return null;
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  select() {
    this.input.select();
  }

  saveInput = (input: HTMLInputElement) => {
    this.input = input;
  };

  setValue(value: string, callback?: () => void) { 
    if (!('value' in this.props)) {
      this.setState({ value }, callback);
    }
  }

  handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setValue('', () => {
      this.focus();
    });
    resolveOnChange(this.input, e, this.props.onChange);
  };

  renderInput = (prefixCls: string) => {
    const { className, addonBefore, addonAfter, size, disabled } = this.props;
    // Fix https://fb.me/react-unknown-prop
    const otherProps = omit(this.props, [
      'prefixCls',
      'onPressEnter',
      'addonBefore',
      'addonAfter',
      'prefix',
      'suffix',
      'allowClear',
      // Input elements must be either controlled or uncontrolled,
      // specify either the value prop, or the defaultValue prop, but not both.
      'defaultValue',
      'size',
      'inputType',
    ]);

    const { value } = this.state;
    // const { prefixCls: customizePrefixCls } = this.props;
    return (
      <input
        {...otherProps}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        className={classNames(getInputClassName(prefixCls, size, disabled), {
          [className!]: className && !addonBefore && !addonAfter,
        })}
        value={fixControlledValue(value)}
        ref={this.saveInput}
      />
    );
  };

  // renderComponent = ({ getPrefixCls }: ConfigConsumerProps) => {
  //   const { value } = this.state;
  //   const { prefixCls: customizePrefixCls } = this.props;
  //   const prefixCls = getPrefixCls('input', customizePrefixCls);
  //   return (
  //     <ClearableLabeledInput
  //       {...this.props}
  //       prefixCls={prefixCls}
  //       inputType="input"
  //       value={fixControlledValue(value)}
  //       element={this.renderInput(prefixCls)}
  //       handleReset={this.handleReset}
  //       ref={this.saveClearableInput}
  //     />
  //   );
  // };

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.setValue(e.target.value);
    resolveOnChange(this.input, e, this.props.onChange);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { onPressEnter, onKeyDown } = this.props;
    if (e.keyCode === 13 && onPressEnter) {
      onPressEnter(e);
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };


  render() {
    return this.renderInput('input');
  }
}


export default Input