import React from 'react'
import RcCheckBox, { Props as RcCheckBoxProps } from 'rc-checkbox'
import classNames from 'classnames';
import './checkbox.less'



interface Props extends RcCheckBoxProps{
  label?:string
  CheckboxButton?:boolean
}

 class Checkbox extends React.Component<Props> {

  public static defaultProps: Readonly<Partial<Props>> = {
   defaultChecked:false
  }
 

  public readonly state = {
   checked:false,
  }

  public  checked = 'checked' in this.props ? this.props.checked : this.props.defaultChecked;


  handleChange = (e:any) => {
    const { disabled, onChange } = this.props;
    if (disabled) {
      return;
    }
    if (!('checked' in this.props)) {
      this.setState({
        checked: e.target.checked,
      });
    }
    if (onChange) {
      // onChange({
      //   target: {
      //     ...this.props,
      //     checked: e.target.checked,
      //   },
      //   stopPropagation() {
      //     e.stopPropagation();
      //   },
      //   preventDefault() {
      //     e.preventDefault();
      //   },
      //   nativeEvent: e.nativeEvent,
      // });
    }
  };

 

  componentDidUpdate(){
    console.log('4567890')
  }


  render() {
    
    const { CheckboxButton, checked, disabled,defaultChecked,onChange } =this.props
    const Checked = 'checked' in this.props ? checked : defaultChecked;

    // console.log(checked,Checked,'check',this.props)

    const prefixCls='checkbox-button-wrapper'

    const classString = classNames(prefixCls, {
      [`${prefixCls}-checked`]: Checked,
      [`${prefixCls}-disabled`]: disabled,

    });

   
    return(
      <label className={CheckboxButton?classString:''}>
       < RcCheckBox {...this.props} ref="checkbox"/>
       <span> {this.props.label}</span>
      </label>
     
    )
  }
}

export default Checkbox