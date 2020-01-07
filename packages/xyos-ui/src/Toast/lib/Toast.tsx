import React from 'react'
import Notification from 'rc-notification'
import classNames from 'classnames'
import Icon from '../../Icon/index'
import './toast.less'

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'
type ConfigContent = React.ReactNode | string
type ConfigDuration = number | (() => void)

export type ConfigOnClose = () => void

export interface ThenableArgument {
  (_: any): any
}

interface MessageApi {
  (content: ConfigContent): MessageType
  (content: ConfigContent, duration: number): MessageType
  (content: ConfigContent, duration: number, onClose: () => void): MessageType
  (content: ConfigContent, onClose: () => void): MessageType
}

/** 实例 */
// let notifier: MessageNotify = null
// let messageInstance: any;
let defaultDuration = 3
let defaultTop: number | null
let messageInstance: any

let key: number = 0
let transitionName = 'move-up'
let getContainer: () => HTMLElement
let maxCount: number

const typeIcon = {
  success: 'filled-success',
  info: 'filled-info',
  error: 'filled-error',
  warning: 'filled-warning',
  loading: 'loading'
}

type NotificationInstanceProps = {
  prefixCls: string
  // placement?: NotificationPlacement;
  // getContainer?: () => HTMLElement;
  // top?: number;
  // bottom?: number;
  // closeIcon?: React.ReactNode;
}

function getNotifier (
  { prefixCls: prefixCls }: NotificationInstanceProps,
  callback: (i: any) => void
) {
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
}

function notice (args: ArgsProps): MessageType {
  const outerPrefixCls = args.prefixCls ? args.prefixCls : 'xyos-message'
  const prefixCls = `${outerPrefixCls}`
  const duration = args.duration !== undefined ? args.duration : defaultDuration
  const target = key++
  let iconNode: React.ReactNode = null

  if (args.icon) {
    iconNode = <span className={`${prefixCls}-icon`}>{args.icon}</span>
  } else if (args.type) {
    const iconType = typeIcon[args.type]
    iconNode = (
      <Icon
        className={`${prefixCls}-icon ${prefixCls}-icon-${args.type}`}
        type={iconType}
      />
    )
  }

  const closePromise = new Promise<boolean>(resolve => {
    const cls = classNames({
      [`${prefixCls}-with-icon`]: iconNode,
      [`${prefixCls}-${args.type}`]: args.type
    })

    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose()
      }
      return resolve(true)
    }

    getNotifier(
      {
        prefixCls: outerPrefixCls
      },
      (instance: any) => {
        instance.notice({
          key: target,
          duration,
          closable: true,
          style: args.style || {},
          className: args.className,
          onClose: callback,
          onClick: args.onClick,
          content: (
            <div className={cls}>
              {iconNode}
              {args.content ? (
                <div className={`${prefixCls}-title`}>{args.content}</div>
              ) : null}
              <div
                className={
                  args.content
                    ? `${prefixCls}-description`
                    : `${prefixCls}-description ${prefixCls}-description-only`
                }
              >
                {args.description}
              </div>
              {args.btn ? (
                <span className={`${prefixCls}-btn`}>{args.btn}</span>
              ) : null}
            </div>
          )
        })
      }
    )
  })

  const result: any = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target)
    }
  }
  result.then = (filled: ThenableArgument, rejected: ThenableArgument) => {
    closePromise.then(filled, rejected)
    result.promise = closePromise
  }
  return result
}

const api: any = {
  open: notice,
  close (key: string) {
    Object.keys(messageInstance).forEach(cacheKey =>
      messageInstance[cacheKey].removeNotice(key)
    )
  },
  // config: setNotificationConfig,
  destroy () {
    Object.keys(messageInstance).forEach(cacheKey => {
      messageInstance[cacheKey].destroy()
      delete messageInstance[cacheKey]
    })
  }
}
;['success', 'info', 'warning', 'error'].forEach(type => {
  api[type] = (args: ArgsProps) =>
    api.open({
      ...args,
      type
    })
})

export interface NotificationApi {
  success (args: ArgsProps): void
  error (args: ArgsProps): void
  info (args: ArgsProps): void
  warn (args: ArgsProps): void
  warning (args: ArgsProps): void
  open (args: ArgsProps): void
  close (key: string): void
  // config(options: ConfigProps): void;
  destroy (): void
}

export default api as NotificationApi
