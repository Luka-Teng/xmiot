import React from 'react'
import { TriggerProps } from 'rc-trigger'
import {
  AlignType,
  AnimationType,
  ActionType,
  BuildInPlacements
} from 'rc-trigger/lib/interface'

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'

export interface AdjustOverflow {
  adjustX?: 0 | 1
  adjustY?: 0 | 1
}

export type RenderFunction = () => React.ReactNode

export interface AbstractTooltipProps {
  prefixCls?: string
  overlayClassName?: string
  style?: React.CSSProperties
  className?: string
  overlayStyle?: React.CSSProperties
  placement?: TooltipPlacement
  builtinPlacements?: BuildInPlacements
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
  transitionName?: string
  trigger?: ActionType
  openClassName?: string
  arrowPointAtCenter?: boolean
  autoAdjustOverflow?: boolean | AdjustOverflow
  // getTooltipContainer had been rename to getPopupContainer
  getTooltipContainer?: (triggerNode: HTMLElement) => HTMLElement
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  children?: React.ReactNode
  // align is a more higher api
  align?: AlignType
  /** Internal. Hide tooltip when hidden. This will be renamed in future. */
  destroyTooltipOnHide?: boolean
  content?: React.ReactNode | RenderFunction
}
export interface TooltipPropsWithOverlay extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction
  overlay: React.ReactNode | RenderFunction
}

export interface TooltipPropsWithTitle extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction
  overlay?: React.ReactNode | RenderFunction
}

export declare type TooltipProps =
  | TooltipPropsWithTitle
  | TooltipPropsWithOverlay

declare class Tooltip extends React.Component<TooltipProps> {}
export default Tooltip
