
import * as React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import MessageBox from './MessageBox'
import './message.less'

type messageWidthType = 'normal' | 'mid'
type messageType = 'error' | 'info' | 'warning'

export interface MessageDataProps {
  type?: messageType
  message?: string
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
  headerText?: string
}

let div: any
const Message = (params: any) => {

  var defaultParams = {
    headerAlign: 'left',
    showHeaderBorder: true,
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    buttonReverse: false,
    maskCanClose: true,
    showClose: true,
    messageWidth: 'normal'
  }

  var newParams = { ...defaultParams, ...params }

  return new Promise((resolve, reject) => {
    // 插入message提示的容器至body
    div = document.createElement('div')
    document.body.appendChild(div)

    const onClose = () => {
      ReactDOM.unmountComponentAtNode(div)
      if (div.parentNode) {
        div.parentNode.removeChild(div)
      }
    }

    let node = (
      <MessageBox messageData={newParams} resolve={resolve} reject={reject} onClose={onClose} />
    )
    // 渲染message
    ReactDOM.render(node, div)
  })
}

export const MessageClose = function () {
  div && ReactDOM.unmountComponentAtNode(div)
}

export default Message