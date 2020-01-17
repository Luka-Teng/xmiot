import * as React from 'react'

type messageWidthType = 'normal' | 'mid'
type messageType = 'error' | 'info' | 'warning'

export interface MessageProps {
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


// declare class Message extends React.Component<MessageProps> {}

declare const Message: (params:MessageProps)=>void

export default Message