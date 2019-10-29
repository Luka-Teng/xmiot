import React from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

interface OptionValue {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  label?: string
  radiobutton?: boolean
  option?: Array<OptionValue>
  name?: string
  defaultValue?: string
  onChange?: (e: Event) => void,
  Component?: any
  disabled?:boolean
  style?: React.CSSProperties;
  className?: string;
}

interface defaultPropsType {
  Component: any
}

class RadioGroup extends React.Component<Props> {

  static defaultProps: defaultPropsType = {
    Component: "div"
  }
  static childContextTypes = {
    radioGroup: PropTypes.object
  }

  static propTypes = {
    name: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired,
    Component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.object
    ]),
    radiobutton: PropTypes.bool
  }

  getChildContext() {
    const { name, defaultValue, onChange, radiobutton,disabled } = this.props;
    return {
      radioGroup: {
        name, 
        defaultValue,
        onChange, 
        radiobutton,
        disabled
      }
    }
  }

  render() { 
    const { Component, name, defaultValue, onChange, children,radiobutton, ...rest } = this.props;
    return (<Component {...rest}>{children}</Component>);
  }
}


export default RadioGroup 