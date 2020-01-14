import React, { Component } from 'react'
import classNames from 'classnames'
import Icon from '../../Icon/index'
import './notice.less'

interface NoticeProps {
  size?: string
  message: string
  type: string
  title?: string
  closable?: boolean
}
const prefixCls = 'xyos-notice'

class Notice extends Component<NoticeProps>{

  state={
    isShow:true
  }

  onClose = () => {
    this.setState({
      isShow:false
    })
  }

  render() {

    let { size, type, title, message, closable=true } = this.props

    const cls = classNames(
      {
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-${size}}`]: size,
        [`${prefixCls}-content`]: true,
        [`${prefixCls}-content-notitle`]: !title
      },
    )

    const wrapCls = classNames(
      {
        [`${prefixCls}-leave`]:!this.state.isShow
      },
      `${prefixCls}-wrap`,
      `${prefixCls}`,
    )

    return (
      <div className={wrapCls}>
        <div className={cls}>
          <Icon className={`${prefixCls}-icon ${prefixCls}-icon-${type}`} theme={title ? null : 'filled'} type={type} />
          {
            title &&
            <div className={`${prefixCls}-title`}>{title}</div>
          }
          <div className={`${prefixCls}-message`}>{message}</div>
        </div>
        {
          closable &&  <Icon className={`${prefixCls}-icon-close`} type='close' onClick={this.onClose} />
        }
      </div>

    )
  }

}

export default Notice