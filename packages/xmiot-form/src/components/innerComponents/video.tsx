import XgPlayer from 'xgplayer'
import React, { PureComponent } from 'react'

type Props = {
  url: string
}

export default class Video extends PureComponent<Props> {
  player: any
  uid: string = '' + Math.random()

  componentDidMount() {
    this.player = new XgPlayer({
      id: this.uid,
      url: this.props.url,
      width: '100%'
    })

    this.player.start()
    this.player.play()
  }

  render() {
    return <div id={this.uid} />
  }
}
