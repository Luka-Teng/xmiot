import React, { Component } from 'react'
import RcAnimate from 'rc-animate'
import xmf from 'xmiot-function'
import './index.less'

console.log(xmf.throttle)

class Animate extends Component {
  render () {
    return (
      <RcAnimate 
        transitionName='xxx'
        transitionAppear={true}
      >
        <p key="1">1</p>
        <p key="2">2</p>
      </RcAnimate>
    )
  }
}

export default Animate
