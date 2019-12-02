import React from 'react'
import classNames from 'classnames';
import './Label.less'
export interface LabelProps {
	align?: 'center';
	style?: object;
  label: string;
	required?: boolean;
	labelClassName?: string;
  content?: React.ReactNode
}
export default class Label extends React.Component<LabelProps>{

	static defaultProps = {
		required: false
  }
	
  render () {
		const {align, label, required, content, labelClassName, children, ...rest } = this.props
		const wrapperClass = classNames('yx-label-wrapper', {'align-center': align === 'center'})
		const labelClass = classNames('yx-label-name', {labelClassName, required: required})
    return (
      <div {...rest} className={wrapperClass}>
				<span className={labelClass}>{label}</span>
				<div>
					{
						children ? children : content
					}
				</div>
    	</div>
    )
  }
}