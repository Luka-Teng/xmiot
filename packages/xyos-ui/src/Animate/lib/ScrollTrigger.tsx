/**
 * @description 第一次展示在视窗中的时候，渲染元素
 * @prop { delay } number 进入视窗后延迟多久展示元素
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
      const heightForViewport =
        window.innerHeight || document.documentElement.clientHeight
      if (topToViewport <= heightForViewport) {
        /* 延迟后再做渲染 */
        if (this.key !== null) {
          clearTimeout(this.key)
        }
        this.key = setTimeout(() => {
          this.setState({ shown: true })
        }, this.props.delay)

        window.removeEventListener('scroll', this.check, true)
      }
    }
  }, 200)

  componentDidMount () {
    this.ref = document.getElementById('ScrollTriggerWrapper')
    /* scroll事件不会向上冒泡，所以要在window捕获需要在捕获阶段触发 */
    window.addEventListener('scroll', this.check, true)
    this.check()
  }

  componentWillUnmount () {
    /* 清理事件 */
    window.removeEventListener('scroll', this.check, true)
    if (this.key !== null) {
      clearTimeout(this.key)
    }
  }

  render () {
    const { delay, ...rest } = this.props
    return (
      <div id="ScrollTriggerWrapper" {...rest}>
        {this.state.shown && this.props.children}
      </div>
    )
  }
}

export default ScrollTrigger
