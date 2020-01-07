import React, { Component } from 'react'
import classNames from 'classnames'
import  Icon from '../../Icon/index'
import './notice.less'

interface NoticeProps{
  size?:string
  message:string
  type:string
  title?:string
}
const prefixCls='xyos-notice'

class Notice extends Component<NoticeProps>{

  render(){

    let {size, type, title, message}= this.props
    const cls = classNames(
      {
        [`${prefixCls}-${type}`]:type,
        [`${prefixCls}-${size}}`]: size,
        [`${prefixCls}-content`]:true,
        [`${prefixCls}-content-notitle`]:!title
      },
    )

    return(
      <div className={`${prefixCls}-wrap`}>
      <div className={cls}>
      <Icon className={`${prefixCls}-icon ${prefixCls}-icon-${type}`} theme={title ? null : 'filled'} type={type} />
      {
        title&&
        <div className={`${prefixCls}-title`}>{title}</div>
      }  
      <div className={`${prefixCls}-message`}>{message}</div>
      </div>
      
      </div>

    )
  }

}

export default Notice