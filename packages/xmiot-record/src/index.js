import React from 'react'
import Recorder from './recorder.min'
/**
 *
 * @param {*} Component  react组件
 * @param {*} autoStop  是否为自动停止，true为自动停止，false为非自动停止
 */
function EnhancedAudio (Component, autoStop) {
  if (!Component) return null
  return class Record extends React.Component {
    constructor (props) {
      super(props)
      this.startTime = 0
      this.recorder = ''
      this.context = ''
      this.stream = ''
      this.state = {
        isRecording: false
      }
    }

    onFail = e => {
      console.log('Rejected!', e)
    }
    onSuccess = s => {
      this.context = new (window.AudioContext || window.webkitAudioContext)()
      var mediaStreamSource = this.context.createMediaStreamSource(s)
      this.stream = s
      if (autoStop) {
        var jsNode = this.context.createScriptProcessor(4096, 1, 1)
        mediaStreamSource.connect(jsNode)
        jsNode.connect(this.context.destination)
        jsNode.onaudioprocess = e => {
          var buffer = e.inputBuffer.getChannelData(0) //获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
          //创建变量并迭代来获取最大的音量值
          var maxVal = 0
          for (var i = 0; i < buffer.length; i++) {
            if (maxVal < buffer[i]) {
              maxVal = buffer[i]
            }
          }
          console.log('maxVal', maxVal)
          //显示音量值
          if (maxVal < 0.2 && this.state.isRecording) {
            if (!this.startTime) {
              this.startTime = +new Date()
            }
            let currentTime = +new Date()
            if (currentTime - this.startTime > 2000) {
              console.warn('停止录音')
              this.stopRecording()
            }
          }
        }
      }
      this.recorder = new Recorder(mediaStreamSource)
      this.recorder.record()
    }

    startRecording = () => {
      // this.isRecording = true
      this.setState({ isRecording: true })
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(stream => {
            console.log('start', '')
            this.onSuccess(stream)
          })
          .catch(err => {
            console.log('err', err)
          })
      } else {
        console.log('navigator.getUserMedia not present')
      }
    }
    stopRecording = () => {
      this.setState({ isRecording: false })
      this.startTime = 0
      this.context.close()
      this.recorder.exportWAV(s => {
        // getData是父组件的接口请求的方法
        this.props.getData(s)
      })
    }
    componentWillUnmount () {
      this.setState = (state, callback) => {
        return
      }
    }
    render () {
      return (
        <Component
          {...this.props}
          startRecording={this.startRecording}
          stopRecording={this.stopRecording}
          isRecording={this.state.isRecording}
        />
      )
    }
  }
}
export default EnhancedAudio
