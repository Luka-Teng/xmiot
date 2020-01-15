import React from 'react'
import RCToast from 'rc-notification'
type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | "topCenter";

export interface ArgsProps {
  content?: React.ReactNode
  duration?: number | null
  type?: NoticeType
  onClose?: () => void
  icon?: React.ReactNode
  key?: string | number
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
  top?: number
  bottom?: number
  description?: string
  btn?: React.ReactNode
  prefixCls?: string
  placement?: NotificationPlacement
}

export interface ConfigProps {
  top?: number;
  bottom?: number;
  duration?: number;
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
  closeIcon?: React.ReactNode;
}

type Props = {
  content: React.ReactNode
  duration: number | null
  type: NoticeType
  onClose?: () => void
  icon?: React.ReactNode
  key?: string | number
}

type staticFunction=(args:ArgsProps, callback:Function)=>{}

declare class Toast extends React.Component<any> {
  static success (args:ArgsProps, callback?:Function)
  static info (args:ArgsProps, callback?:Function)
  static error (args:ArgsProps, callback?:Function)
  static warning (args:ArgsProps, callback?:Function)
  static loading (args:ArgsProps, callback?:Function)
  static open (args:ArgsProps, callback?:Function)
  static config (args:ConfigProps, callback?:Function)
}


export default Toast