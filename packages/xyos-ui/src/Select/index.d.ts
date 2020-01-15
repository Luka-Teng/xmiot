import React from 'react'
import RcSelect, {
  Option as RcOption,
  OptGroup as RcOptionGroup,
  SelectProps
} from 'rc-select'
import { OptionData } from 'rc-select/lib/interface/index'

type X = Pick<SelectProps, Exclude<keyof SelectProps, 'onChange'>>

type Props = {
  size?: string
  optionLabelProp?: string
  disabled?: boolean
  labelInValue?: boolean
} & X

interface OptionProps extends OptionData {
  label?: string
  children?: React.ReactNode
  className?: string
}

export interface OptionFC extends React.FC<OptionProps> {
  /** Legacy for check if is a Option Group */
}

export interface OptGroupProps extends Omit<OptGroupProps, 'options'> {
  children?: React.ReactNode
  label?: React.ReactNode
}

export declare const OptGroup: OptGroupProps
export declare const Option: OptionFC
declare class Select extends React.Component<Props> {
  static OptGroup: typeof OptGroup
  static Option: typeof Option
}

export { Select }
