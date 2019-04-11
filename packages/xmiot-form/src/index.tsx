import React, { Component } from 'react'
import 'antd/dist/antd.css'

import './assets/index.less'
import Form from './form'

class A extends Component {
  ref = React.createRef()
  render () {
    return <Form options={[{
      type: 'input',
      name: 'test',
      label: 'test'
    }, {
      type: 'select',
      name: 'aaa',
      label: 'test',
      styles: {
        display: '1/3'
      },
      config: {
        data: [{
          name: '11',
          value: '11'
        }, {
          name: '112',
          value: '112'
        }],
        initialValue: '11',
        onSelectChange: () => {
          console.log(1111)
        }
      }
    }]} onSubmit={() => {}} formRef={this.ref} />
  }
}

export default A