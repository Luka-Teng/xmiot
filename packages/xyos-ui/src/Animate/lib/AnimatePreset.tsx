/**
 * @description 预设动画集
 * @prop { preset } string 动画名，目前预设 "fade | fadeInLeft | fadeInRight"
 * @prop { offset } number 如果有多个子元素，每个子元素的动画开始时间偏移量
 * @prop { duration } number 动画的持续时间
 */

import React from 'react'
import Animate from 'rc-animate'

import './animatePreset.less'

type Props = {
  preset?: 'fade' | 'fadeInLeft' | 'fadeInRight'
  offset?: number
  duration?: number
} & React.HTMLAttributes<React.ReactElement>

type State = {
  newKeys: any[]
  leaveKeys: any[]
  prevChildren: React.ReactElement[]
}

const toArrayChildren = (children: React.ReactNode[] | React.ReactNode) => {
  const _children = React.Children.map(children, (child, i) => {
    if (typeof child === 'string') {
      child = React.createElement('div', {
        children: child,
        key: `${i}`
      })
    }
    return child
  })

  if (_children === null || _children === undefined) return []

  if (Object.prototype.toString.call(_children) === '[object Array]')
    return _children

  return [_children]
}

class AnimatePreset extends React.Component<Props, State> {
  static defaultProps = {
    preset: 'fadeInRight',
    offset: 0,
    duration: 1000
  }

  /**
   * 剥离出新增加元素和被移除元素
   * 如果splice算作O(n), 这个该算法复杂度会达到O(n^3)
   */
  static getDerivedStateFromProps (nextProps: Props, prevState: State) {
    const newChildren = toArrayChildren(nextProps.children)
    const leaveChildren: React.ReactNode[] = prevState.prevChildren

    for (let i = 0; i < newChildren.length; i++) {
      let flag = true

      for (let j = 0; j < leaveChildren.length; j++) {
        if (flag === true) flag = false

        const newKey = (newChildren[i] as React.ReactElement).key || i
        const leaveKey = (leaveChildren[j] as React.ReactElement).key || j

        if (newKey === leaveKey) {
          newChildren.splice(i, 1)
          leaveChildren.splice(j, 1)
          i--
          j--
          break
        }
      }

      if (flag) break
    }

    return {
      newKeys: newChildren.map(child => (child as React.ReactElement).key),
      leaveKeys: leaveChildren.map(child => (child as React.ReactElement).key),
      prevChildren: toArrayChildren(nextProps.children)
    }
  }

  state: State = {
    newKeys: [],
    prevChildren: [],
    leaveKeys: []
  }

  domRefs: any[] = []

  /* 更新时统一管理delays */
  componentDidUpdate () {
    if (this.props.offset) {
      let i = 0
      Object.keys(this.domRefs).forEach(key => {
        if (this.state.leaveKeys.includes(key)) {
          this.domRefs[key as any].style['animationDelay'] = `0s`
        }

        if (this.state.newKeys.includes(key)) {
          this.domRefs[key as any].style['animationDelay'] = `${(i++ *
            (this.props.offset as number)) /
            1000}s`
        }
      })
    }
    return null
  }

  /* 第一次挂载时统一管理delays */
  componentDidMount () {
    if (this.props.offset) {
      let i = 0
      Object.keys(this.domRefs).forEach(key => {
        if (this.state.newKeys.includes(key)) {
          this.domRefs[key as any].style['animationDelay'] = `${(i++ *
            (this.props.offset as number)) /
            1000}s`
        }
      })
    }
  }

  render () {
    const { preset, offset, duration, ...rest } = this.props
    return (
      <Animate
        component="div"
        transitionName={`xy-${preset}`}
        transitionAppear={true}
        componentProps={rest}
      >
        {toArrayChildren(this.props.children).map((child, i) => {
          const key = (child && (child as React.ReactElement).key) || i
          return (
            <div
              key={key}
              ref={ref => {
                this.domRefs[key as any] = ref
              }}
              style={{
                animationDuration: `${(duration as number) / 1000}s`
              }}
            >
              {child}
            </div>
          )
        })}
      </Animate>
    )
  }
}

export default AnimatePreset
