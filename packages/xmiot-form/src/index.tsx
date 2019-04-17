import React, { Component } from 'react'
import 'antd/dist/antd.css'

import './assets/index.less'
import Form from './form'

class A extends Component {
  ref = React.createRef()
  render() {
    window.mytest = this.ref
    return (
      <Form
        options={[
          {
            type: 'input',
            name: 'test',
            label: 'test',
            styles: {
              display: '1/4'
            },
            config: {
              onChange: value => {
                console.log(value.target.value)
              }
            }
          },
          {
            type: 'select',
            name: 'aaa',
            label: 'test',
            styles: {
              display: '1/4'
            },
            config: {
              data: [
                {
                  name: '11',
                  value: '11'
                },
                {
                  name: '112',
                  value: '112'
                }
              ],
              initialValue: '11',
              onSelectChange: () => {
                console.log(1111)
              }
            }
          },
          {
            type: 'textarea',
            name: 'testa',
            label: 'test',
            styles: {
              display: '1/1'
            },
            config: {
              onChange: e => {
                console.log(e.target.value)
              },
              onPressEnter: e => {
                console.log(e.target.value)
              }
            }
          },
          {
            type: 'datePicker',
            name: 'tests',
            label: 'test',
            styles: {
              display: '1/2'
            },
            config: {
              range: false,
              onChange: (date, dateString) => {
                console.log(date)
                console.log(dateString)
              }
            }
          },
          {
            type: 'checkGroup',
            name: 'testsx',
            label: 'test',
            styles: {
              display: '1/2'
            },
            config: {
              data: [
                {
                  label: 'aa',
                  value: '11'
                },
                {
                  label: 'aaa',
                  value: '11a'
                }
              ],
              onChange: date => {
                console.log(date)
              },
              checkAllBtn: true
            }
          },
          {
            type: 'upload',
            name: 'video',
            label: '视频',
            styles: {
              display: '1/1'
            },
            config: {
              initialValue: [],
              onUpload: (
                file: any,
                success: any,
                fail: any,
                onProgress: any
              ) => {
                success(
                  'http://static2.pp.ximalaya.com/sr012018/xiaoya-os-open-platform/last/build/static/media/login-bg.d1cb9cbd.png'
                )
              },
              maxNumber: 10,
              maxSize: 102400,
              accept: 'video'
            }
          },
          {
            type: 'radioGroup',
            name: 'radio',
            label: '不知道',
            styles: {
              display: '1/1'
            },
            config: {
              data: [
                {
                  label: 'luka',
                  value: 'wtf',
                  appendElement: (
                    <div>
                      <img
                        width="200px"
                        src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg"
                      />
                    </div>
                  )
                },
                {
                  label: 'luka1',
                  value: 'wtf1'
                }
              ],
              onChange: values => {
                console.log(values)
              }
            }
          },
          {
            type: 'colorPicker',
            name: 'color',
            label: 'colors'
          }
        ]}
        onSubmit={() => {}}
        formRef={this.ref}
      />
    )
  }
}

export default A
