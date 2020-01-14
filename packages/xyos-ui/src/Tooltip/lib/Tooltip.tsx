import * as React from 'react'
import RcTooltip from 'rc-tooltip'
import classnames from 'classnames'
import {
  AlignType,
  ActionType,
  BuildInPlacements
} from 'rc-trigger/lib/interface'
import getPlacements, { AdjustOverflow, PlacementsConfig } from './placements'
import './tooltip.less'

// export { AdjustOverflow, PlacementsConfig };

export interface ConfigConsumerProps {
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  rootPrefixCls?: string
  getPrefixCls: (suffixCls: string, customizePrefixCls?: string) => string
  pageHeader?: {
    ghost: boolean
  }
  direction?: 'ltr' | 'rtl'
}

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

export interface PopoverProps extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction

  overlay?: React.ReactNode | RenderFunction
}

export declare type TooltipProps =
  | TooltipPropsWithTitle
  | TooltipPropsWithOverlay

interface TooltipState {
  visible: boolean
}

const splitObject = (obj: any, keys: string[]) => {
  const picked: any = {}
  const omitted: any = { ...obj }
  keys.forEach(key => {
    if (obj && key in obj) {
      picked[key] = obj[key]
      delete omitted[key]
    }
  })
  return { picked, omitted }
}

function getDisabledCompatibleChildren (element: React.ReactElement<any>) {
  const elementType = element.type as any
  if (
    (elementType.__XYOS_BUTTON === true ||
      elementType.__ANT_SWITCH === true ||
      elementType.__ANT_CHECKBOX === true ||
      element.type === 'button') &&
    element.props.disabled
  ) {
    // Pick some layout related style properties up to span
    const { picked, omitted } = splitObject(element.props.style, [
      'position',
      'left',
      'right',
      'top',
      'bottom',
      'float',
      'display',
      'zIndex'
    ])
    const spanStyle = {
      display: 'inline-block', // default inline-block is important
      ...picked,
      cursor: 'not-allowed',
      width: element.props.block ? '100%' : null
    }
    const buttonStyle = {
      ...omitted,
      pointerEvents: 'none'
    }
    const child = React.cloneElement(element, {
      style: buttonStyle,
      className: null
    })
    return (
      <span style={spanStyle} className={element.props.className}>
        {child}
      </span>
    )
  }
  return element
}
class Tooltip extends React.Component<TooltipProps, TooltipState> {
  static defaultProps = {
    placement: 'top' as TooltipPlacement,
    // transitionName: 'zoom-big-fast',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
    target: 'hover'
  }

  static getDerivedStateFromProps (nextProps: TooltipProps) {
    if ('visible' in nextProps) {
      return { visible: nextProps.visible }
    }
    return null
  }

  private tooltip = React.createRef<typeof RcTooltip>()

  constructor (props: TooltipProps) {
    super(props)
    this.state = {
      visible: !!props.visible || !!props.defaultVisible
    }
  }

  isNoTitle () {
    const { title, overlay } = this.props
    return !title && !overlay // overlay for old version compatibility
  }

  getPopupDomNode () {
    return (
      this.tooltip.current && (this.tooltip.current as any).getPopupDomNode()
    )
  }

  // 显示隐藏的回调
  onVisibleChange = (visible: boolean) => {
    const { onVisibleChange } = this.props
    if (!('visible' in this.props)) {
      this.setState({ visible: this.isNoTitle() ? false : visible })
    }
    if (onVisibleChange && !this.isNoTitle()) {
      onVisibleChange(visible)
    }
  }

  getPlacements () {
    const {
      builtinPlacements,
      arrowPointAtCenter,
      autoAdjustOverflow
    } = this.props
    return (
      builtinPlacements ||
      getPlacements({
        arrowPointAtCenter,
        verticalArrowShift: 8,
        autoAdjustOverflow
      })
    )
  }

  // 动态设置动画点
  onPopupAlign = (domNode: HTMLElement, align: any) => {
    const placements: any = this.getPlacements()

    // 当前返回的位置
    const placement = Object.keys(placements).filter(
      key =>
        placements[key].points[0] === align.points[0] &&
        placements[key].points[1] === align.points[1]
    )[0]
    if (!placement) {
      return
    }
    // 根据当前坐标设置动画点
    const rect = domNode.getBoundingClientRect()
    const transformOrigin = {
      top: '50%',
      left: '50%'
    }
    if (placement.indexOf('top') >= 0 || placement.indexOf('Bottom') >= 0) {
      transformOrigin.top = `${rect.height - align.offset[1]}px`
    } else if (
      placement.indexOf('Top') >= 0 ||
      placement.indexOf('bottom') >= 0
    ) {
      transformOrigin.top = `${-align.offset[1]}px`
    }
    if (placement.indexOf('left') >= 0 || placement.indexOf('Right') >= 0) {
      transformOrigin.left = `${rect.width - align.offset[0]}px`
    } else if (
      placement.indexOf('right') >= 0 ||
      placement.indexOf('Left') >= 0
    ) {
      transformOrigin.left = `${-align.offset[0]}px`
    }
    domNode.style.transformOrigin = `${transformOrigin.left} ${
      transformOrigin.top
    }`
  }

  getOverlay () {
    const prefixCls = 'xyos-tooltip'
    const { title, content } = this.props
    if (title && !content) {
      return title
    }
    if (title && content) {
      return (
        <div>
          {title && <div className={`${prefixCls}-popover-title`}>{title}</div>}
          <div className={`${prefixCls}-popover-inner-content`}>{content}</div>
        </div>
      )
    }
  }

  render () {
    const { props, state } = this
    const {
      title,
      content,
      overlay,
      openClassName,
      getPopupContainer,
      getTooltipContainer,
      overlayClassName
    } = props

    let { visible } = state

    let direction

    const children = props.children as React.ReactElement<any>

    const child = getDisabledCompatibleChildren(
      React.isValidElement(children) ? children : <span>{children}</span>
    )

    const childProps = child.props

    const prefixCls = 'xyos-tooltip'

    const childCls = classnames(childProps.className, {
      [openClassName || `${prefixCls}-open`]: true
    })

    const customOverlayClassName = classnames(overlayClassName, {
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-notitle`]: !content
    })

    return (
      <RcTooltip
        {...this.props}
        prefixCls={prefixCls}
        getTooltipContainer={getPopupContainer || getTooltipContainer}
        ref={this.tooltip}
        overlayClassName={customOverlayClassName}
        overlay={this.getOverlay()}
        builtinPlacements={this.getPlacements()}
        onVisibleChange={this.onVisibleChange}
        visible={visible}
        onPopupAlign={this.onPopupAlign}
      >
        {visible ? React.cloneElement(child, { className: childCls }) : child}
      </RcTooltip>
    )
  }
}

export default Tooltip
