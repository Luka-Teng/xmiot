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

class AnimatePreset extends React.Component<Props> {

  static defaultProps = {
    preset: 'fadeInRight',
    offset: 0,
    duration: 1000
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
        {
          React.Children.map(this.props.children, (child, i) => {
            return (
              <div
                key={child && (child as React.ReactElement).key || i}
                style={{
                  animationDuration: `${(duration as number) / 1000}s`,
                  animationDelay: `${(offset as number) * i / 1000}s`
                }}
              >
                {child}
              </div>
            )
          })
        }
      </Animate>
    )
  }
}

export default AnimatePreset