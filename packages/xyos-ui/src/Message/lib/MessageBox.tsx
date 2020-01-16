
import * as React from 'react'
import classnames from 'classnames'
import Icon from '../../Icon'
import Button from '../../Button'

type messageWidthType = 'normal' | 'mid'
type messageType = 'error' | 'question' | 'warning'

export interface MessageDataProps {
  message?: string
  headerText?: string
  title?: string
  headerAlign?: string,
  showHeaderBorder?: boolean,
  showCancelButton?: boolean,
  showConfirmButton?: boolean,
  confirmButtonText?: string,
  cancelButtonText?: string,
  buttonReverse?: boolean,
  maskCanClose?: boolean,
  showClose?: boolean,
  messageWidth?: messageWidthType,
  className?: string
  type?: messageType

}

export interface MessageBoxProps {
  messageData: MessageDataProps,
  resolve?: Function,
  reject?: Function,
  onClose?: Function
}

class MessageBox extends React.Component<MessageBoxProps> {

  onClickBox = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  onClickMask = () => {
    if (this.props.messageData.maskCanClose) {
      this.onClose()
      this.emit('cancel')
    }
  }

  onConfirm = (e: React.MouseEvent<HTMLDivElement>) => {
    this.onClose()
    this.emit('confirm')
  }

  onCancel = () => {
    this.onClose()
    this.emit('cancel')
  }

  onClose = () => {
    const { onClose } = this.props
    if (onClose) {
      onClose()
    }
  }

  emit = (e: any) => {
    const { resolve } = this.props
    if (resolve) {
      resolve(e)
    }
  }

  render() {
    let {
      messageWidth,
      headerText,
      className,
      showHeaderBorder,
      headerAlign,
      buttonReverse,
      showConfirmButton,
      confirmButtonText,
      showCancelButton,
      message,
      showClose,
      title,
      type,
      cancelButtonText

    } = this.props.messageData

    const prefixCls = 'xyos-messageBox'

    let messageClass = classnames(className, prefixCls, {
      mid: messageWidth === 'mid',
      [`${prefixCls}-hasHeader`]:headerText

    })

    let headerClass = classnames({
      headerBorder: showHeaderBorder,
      [`${prefixCls}-header`]: true,
      [`${prefixCls}-header-${headerAlign}`]: headerAlign
    })

    // let messageContent = classnames ({
    //   [`${prefixCls}-inner-content`]:true,


    // })

    let btnList = buttonReverse
      ? ['confirm', 'cancel']
      : ['cancel', 'confirm']

    return (
      <div className='xyos-message-container' onClick={this.onClickMask}>
        <div className={messageClass} onClick={this.onClickBox}>
          <div className={`${prefixCls}-content`}>
            {
              headerText &&
              <div className={headerClass}>
               <span className="left" dangerouslySetInnerHTML={{ __html: headerText}}/>
                {showClose && (
                  <span className="close" onClick={this.onClose} />
                )}
              </div>
            }

            <div className={`${prefixCls}-inner-content`}>
              {
                type && <Icon theme='filled' type={type} className={`${prefixCls}-icon`} />
              }
              {
                title && <p className={`${prefixCls}-inner-title`}>{title}</p>
              }
              {
                message &&
                <div
                  className='inner-text'
                  dangerouslySetInnerHTML={{
                    __html: message
                  }}
                />
              }
            </div>
          </div>

          <div className="btnList">
            {btnList.map(btn => {
              if (btn === 'confirm' && showConfirmButton) {
                return (
                  <Button  type='primary' onClick={this.onConfirm}>{confirmButtonText}</Button>
                )
              } else if (btn === 'cancel' && showCancelButton) {
                return (
                  <Button onClick={this.onCancel}>{cancelButtonText}</Button>
                )
              }
            })}
          </div>
        </div>
      </div>
    )
  }
}


export default MessageBox