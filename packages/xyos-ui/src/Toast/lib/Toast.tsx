import React from 'react'
import Notification from 'rc-notification'
import './toast.less'

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export interface ThenableArgument {
  (_: any): any
}

export interface MessageType {
  (): void
  then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>
  promise: Promise<void>
}

/** 实例 */
// let notifier: MessageNotify = null
// let messageInstance: any;
let defaultDuration = 3
let defaultTop: number | null
let messageInstance: any
let key: number = 0
const prefixCls = 'message-notice'
let transitionName = 'move-up'
let getContainer: () => HTMLElement
let maxCount: number

function getNotifier (callback: (i: any) => void) {
  if (messageInstance) {
    callback(messageInstance)
    return
  }

  Notification.newInstance(
    {
      prefixCls,
      transitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer,
      maxCount
    },
    (instance: any) => {
      if (!messageInstance) {
        messageInstance = instance
      }
      callback(instance)
    }
  )
}

export interface MessageType {
  (): void
  then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>
  promise: Promise<void>
}
export interface ArgsProps {
  content: React.ReactNode
  duration: number | null
  type: NoticeType
  onClose?: () => void
  icon?: React.ReactNode
  key?: string | number
}

function notice (args: ArgsProps): MessageType {
  const duration = args.duration !== undefined ? args.duration : defaultDuration
  const target = key++
  const closePromise = new Promise<boolean>(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose()
      }
      return resolve(true)
    }
    getNotifier(instance => {
      instance.notice({
        key: target,
        duration,
        style: {},
        content: (
          <div
            className={`${prefixCls}-content${
              args.type ? ` ${prefixCls}-${args.type}` : ''
            }`}
          >
            <span>{args.content}</span>
          </div>
        ),
        onClose: callback
      })
    })
  })
  const result: any = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target)
    }
  }
  result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
    closePromise.then(filled, rejected)
  result.promise = closePromise
  return result
}

type ConfigContent = React.ReactNode | string
type ConfigDuration = number | (() => void)
export type ConfigOnClose = () => void

interface MessageApi {
  (cotent: ConfigContent): MessageType
  (cotent: ConfigContent, duration: number): MessageType
  (cotent: ConfigContent, duration: number, onClose: () => void): MessageType
  (content: ConfigContent, onClose: () => void): MessageType
}

function getApi (type: NoticeType): MessageApi {
  return (
    content: ConfigContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose
  ): MessageType => {
    if (typeof duration === 'function') {
      onClose = duration
      duration = undefined
    }
    return open({ content, duration: duration as number, type, onClose })
  }
}

export const open = notice
export function destroy () {
  if (messageInstance) {
    messageInstance.destroy()
    messageInstance = null
  }
}
export const success = getApi('success')
export const error = getApi('error')
export const loading = getApi('loading')
export const warning = getApi('warning')

export default {
  success,
  error,
  loading,
  warning
}
