import React, { Component } from 'react'
import 'antd/dist/antd.css'

import './assets/index.less'
import Form from './form'

class A extends Component {
  ref = React.createRef()
  render () {
    return <Form options={[]} onSubmit={() => {}} formRef={this.ref} />
  }
}

export default A