import React from 'react'
import RcSelect, { Option as RcOption, SelectProps } from 'rc-select'
import { OptionData } from 'rc-select/lib/interface/index'

interface OptionProps extends OptionData {
  label?: never
}

const Option = RcOption as React.FC<OptionProps>

class Select extends React.Component<SelectProps> {
  static Option = Option

  render () {
    return (
      <div>
        <RcSelect>
          <Option title="jack" value="tyhhh">
            jack
          </Option>
          <Option title="lucy" value="22">
            lucy
          </Option>
        </RcSelect>
      </div>
    )
  }
}

export default Select
