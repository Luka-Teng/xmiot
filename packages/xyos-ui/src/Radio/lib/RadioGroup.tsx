import React from 'react'
import PropTypes from 'prop-types';
import Radio from './Radio'


export interface RadioGroupProps {
  radiobutton?: boolean
  name?: string
  defaultValue?: string
  onChange?: (e: string|undefined) => void,
  disabled?:boolean
  style?: React.CSSProperties;
  className?: string;
}

export const ThemeContext = React.createContext({});

class RadioGroup extends React.Component<RadioGroupProps> {

  render() { 
    const {  name, defaultValue, onChange, children,radiobutton, ...rest } = this.props;
    return (
    <ThemeContext.Provider value={this.props}>
     {
      children
     }
    </ThemeContext.Provider>);
  }
}

export default RadioGroup 