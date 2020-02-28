import React from 'react'
import Notification from 'rc-notification'
// import { NotificationInstance as RCNotificationInstance } from 'rc-notification/lib/Notification';
import classNames from 'classnames'
import Icon from '../../Icon/index'
import './toast.less'

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'
type ConfigContent = React.ReactNode | string
type ConfigDuration = number | (() => void)
export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | "topCenter";

export type ConfigOnClose = () => void

export interface ThenableArgument {
  (_: any): any
}

/** 实例 */
// let notifier: MessageNotify = null
let defaultDuration = 3
let defaultTop = 24;
let defaultBottom = 24;
// let messageInstance: any;
let defaultGetContainer: () => HTMLElement;
const messageInstance: { [key: string]: any } = {};

let key: number = 0
let transitionName = 'move-up'
let getContainer: () => HTMLElement
let maxCount: number
let defaultCloseIcon: React.ReactNode;
let defaultPlacement: NotificationPlacement = 'topRight';


const typeIcon = {
  success: 'filled-success',
  info: 'filled-info',
  error: 'filled-error',
  warning: 'filled-warning',
  loading: 'loading'
}

export interface ConfigProps {
  top?: number;
  bottom?: number;
  duration?: number;
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
  closeIcon?: React.ReactNode;
}

type NotificationInstanceProps = {
  prefixCls: string
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
  top?: number;
  bottom?: number;
  closeIcon?: React.ReactNode;
}

export interface MessageType {
  (): void
  then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>
  promise: Promise<void>
}

export interface ArgsProps {
  content?: string | React.ReactNode
  duration?: number | null
  type?: NoticeType
  onClose?: () => void
  icon?: React.ReactNode
  key?: string | number
  style?: React.CSSProperties
  className?: string
  onClick?: () => void
  placement?: NotificationPlacement;
  top?: number
  bottom?: number
  description?: string | React.ReactNode
  btn?: React.ReactNode
  prefixCls?: string
  getContainer?: () => HTMLElement;
  closeIcon?: React.ReactNode;
}

function setNotificationConfig(options: ConfigProps) {
  const { duration, placement, bottom, top, getContainer, closeIcon } = options;
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = bottom;
  }
  if (top !== undefined) {
    defaultTop = top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }
}

function getPlacementStyle(
  placement: NotificationPlacement,
  top: number = defaultTop,
  bottom: number = defaultBottom,
) {
  let style;
  switch (placement) {
    case 'topLeft':
      style = {
        left: 0,
        top,
        bottom: 'auto',
      };
      break;
    case 'topRight':
      style = {
        right: 0,
        top,
        bottom: 'auto',
      };
      break;
    case 'bottomLeft':
      style = {
        left: 0,
        top: 'auto',
        bottom,
      };
      break;
    case 'topCenter':
      style = {
        top: 0,
        margin: '0 auto',
        left: 0,
        right: 0,
        bottom: 'auto',
      };
      break;
    default:
      style = {
        right: 0,
        top: 'auto',
        bottom,
      };
      break;
  }
  return style;
}

function getNotifier(
  {
    prefixCls,
    top,
    bottom,
    placement = defaultPlacement,
    getContainer = defaultGetContainer,
    closeIcon = defaultCloseIcon,
  }: NotificationInstanceProps,
  callback: (i: any) => void
) {
  const cacheKey = `${prefixCls}-${placement}`;

  const closeIconToRender = (
    <span className={`${prefixCls}-close-x`}>
      {closeIcon || <Icon type='close' className={`${prefixCls}-close-icon`} />}
    </span>
  );

  if (messageInstance) {
    if (messageInstance[cacheKey]) {
      callback(messageInstance[cacheKey]);
      return;
    }
  }

  Notification.newInstance(
    {
      prefixCls,
      className: `${prefixCls}-${placement}`,
      transitionName,
      style: getPlacementStyle(placement, top, bottom),
      getContainer,
      maxCount,
      closeIcon: closeIconToRender,
    },
    (instance: any) => {
      if (!messageInstance) {
        messageInstance = instance
      }
      messageInstance[cacheKey] = instance;
      callback(instance)
    }
  )
}



function notice(args: ArgsProps): MessageType {
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

    const { placement, top, bottom, getContainer, closeIcon } = args;
    getNotifier(
      {
        prefixCls: outerPrefixCls,
        placement,
        top,
        bottom,
        getContainer,
        closeIcon
      },
      (instance: any) => {
        instance.notice({
          // key: target,
          key: args.key,
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
  close(key: string) {
    Object.keys(messageInstance).forEach(cacheKey =>
      messageInstance[cacheKey].removeNotice(key)
    )
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(messageInstance).forEach(cacheKey => {
      messageInstance[cacheKey].destroy()
      delete messageInstance[cacheKey]
    })
  }
};

['success', 'info', 'warning', 'error'].forEach(type => {
  api[type] = (args: ArgsProps) =>
    api.open({
      ...args,
      type
    })
})

export interface NotificationApi {
  success(args: ArgsProps): void
  error(args: ArgsProps): void
  info(args: ArgsProps): void
  warning(args: ArgsProps): void
  open(args: ArgsProps): void
  close(key: string): void
  config(options: ConfigProps): void;
  destroy(): void
}

export default api as NotificationApi
