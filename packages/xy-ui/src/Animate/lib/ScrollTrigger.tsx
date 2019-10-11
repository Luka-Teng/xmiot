/**
 * @description 第一次展示在视窗中的时候，渲染元素
 * @prop { type } string 动画名，目前预设"fade | fadeInLeft | fadeInRight"
 * @prop { delay } number 进入视窗后延迟多久展示元素
 * @prop { offset } number 如果有多个子元素，每个子元素的动画开始时间偏移量
 * @prop { duration } number 动画的持续时间
 */

import React from 'react'
import { throttle } from './utils'

type Props = {
  delay?: number
} & React.HTMLAttributes<HTMLDivElement>

type State = {
  shown: boolean
}

class ScrollTrigger extends React.Component<Props, State> {

  static defaultProps = {
    delay: 0
  }

  private ref: HTMLElement | null = null
  private key: any = null
  public state = {
    shown: false
  }

  check = throttle(() => {
    if (this.ref !== null) {
      const topToViewport = this.ref.getBoundingClientRect().top
      const heightForViewport = window.innerHeight || document.documentElement.clientHeight
      if (topToViewport < heightForViewport) {

        /* 延迟后再做渲染 */
        if (this.key !== null) { clearTimeout(this.key) }
        this.key = setTimeout(() => {
          this.setState({ shown: true })
        }, this.props.delay)
        
        window.removeEventListener('scroll', this.check)
      }
    }
  }, 200)

  componentDidMount () {
    this.ref = document.getElementById('ScrollTriggerWrapper')
    window.addEventListener('scroll', this.check)
    this.check() 
  }

  componentWillUnmount () {
    /* 清理事件 */
    window.removeEventListener('scroll', this.check)
    if (this.key !== null) { clearTimeout(this.key) }
  }

  render () {
    const { delay, ...rest } = this.props
    return (
      <div id="ScrollTriggerWrapper" {...rest}>
        {
          this.state.shown && this.props.children
        }
      </div>
    )
  }
}

export default ScrollTrigger