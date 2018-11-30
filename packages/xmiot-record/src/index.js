import React from 'react'
import Recorder from 'recorder-js'
export default class Record extends React.Component {
  constructor (props) {
    super(props)
    this.audio = React.createRef()
    this.state = {
      recorder: ''
    }
  }

  onFail = e => {
    console.log('Rejected!', e)
  }
  onSuccess = s => {
    var context = new (window.AudioContext || window.webkitAudioContext)()
    var mediaStreamSource = context.createMediaStreamSource(s)
    let recorder = new Recorder(mediaStreamSource)
    this.setState({ ...this.state, recorder }, () => {
      this.recorder.record()
    })
    // audio loopback
    // mediaStreamSource.connect(context.destination);
  }
  init = () => {
    window.URL = window.URL || window.webkitURL
    window.navigator.getUserMedia =
      window.navigator.getUserMedia ||
      window.navigator.webkitGetUserMedia ||
      window.navigator.mozGetUserMedia ||
      window.navigator.msGetUserMedia
    this.startRecording()
  }

  startRecording = () => {
    console.log('qqqqqq', '')
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, this.onSuccess, this.onFail)
    } else {
      console.log('navigator.getUserMedia not present')
    }
  }
  stopRecording = () => {
    this.recorder.stop()
    this.recorder.exportWAV(function (s) {
      this.audio.src = window.URL.createObjectURL(s)
    })
  }
  render () {
    return (
      <div>
        <audio ref={this.audio} autoPlay controls />
        <input onClick={this.init} type="button" value="init recording" />
        <input
          onClick={this.stopRecording}
          type="button"
          value="stop recording and play"
        />
      </div>
    )
  }
}
