declare module 'rc-select' {
  import * as React from 'react'

  export interface OptGroupProps extends Omit<OptionGroupData, 'options'> {
    children?: React.ReactNode;
  }
  export interface OptionGroupFC extends React.FC<OptGroupProps> {
    /** Legacy for check if is a Option Group */
    isSelectOptGroup: boolean;
  }

  export interface OptionFC extends React.FC<OptionProps> {
    /** Legacy for check if is a Option Group */
    isSelectOption: boolean;
  }

  export declare type SelectProps<ValueType extends DefaultValueType = DefaultValueType> = SelectProps<SelectOptionsType, ValueType>;
  
  /** This is a placeholder, not real render in dom */
 export declare const OptGroup: OptionGroupFC;

  /** This is a placeholder, not real render in dom */
  export declare const Option: OptionFC;

  declare class Select<VT> extends React.Component<SelectProps<SelectOptionsType, VT>> {
    static Option: typeof Option;
    static OptGroup: typeof OptGroup;
    selectRef: React.RefObject<RefSelectProps>;
    focus: () => void;
    blur: () => void;
    render(): JSX.Element;
}

export default Select;
}
