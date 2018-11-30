import './index.less'
// import pic from './bg.png'
import fn from 'xmiot-function'
import React from 'react'
import t, { a } from './test'
window.env = process.env.NODE_ENV
class Test extends React.Component {
  render () {
    console.log(fn)
    console.log(a)
    console.log(t)
    return <div>111111211</div>
  }
}
export default Test
