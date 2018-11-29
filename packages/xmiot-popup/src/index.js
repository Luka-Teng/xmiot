import React from 'react'
import classnames from 'classnames'
import './index.less'
class Popup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: true,
      title: '这是一个title', // 头部title
      subtitle: '这是一个副标题', // 头部副标题
      isShowLeft: true, // 是否显示 header 左边
      isShowRight: true,
      isShowHeader: false, // 是否显示 弹窗的头部 如果传了 title 默认显示title
      cancleTxt: '取消',
      confirmTxt: '确定',
      btnWidth: '120px',
      btnBorderRadius: '7px'
    }
  }

  componentDidMount () {
    console.log('挂在完成')
  }

  onClose = () => {
    alert(4324)
  }

  render () {
    let classes = classnames('xmiot-popup-wrap', { show: this.state.show })
    return (
      <div className={classes}>
        <div className="mask" onClick={this.props.onClose} />
        <div
          className="xmiot-popup-container"
          style={{ width: '500px', height: '500px', backgroundColor: '#fff' }}
        >
          <div className="content-container">
            {(this.state.isShowHeader || this.state.title) && (
              <div
                className="header-item"
                style={{
                  fontSize: '20px',
                  lineHeight: '30px',
                  padding: '20px'
                }}
              >
                {this.state.isShowLeft && (
                  <span className="left-icon">返回</span>
                )}
                {this.state.title && (
                  <div className="header-title">
                    <p className="title">{this.state.title}</p>
                    <p className="subtitle">{this.state.subtitle}</p>
                  </div>
                )}
                {this.state.isShowRight && (
                  <span className="right-icon" onClick={this.onClose}>
                    X
                  </span>
                )}
              </div>
            )}
            <div
              className="content-item"
              style={{ height: '300px', textAlign: 'center' }}
            >
              这里是 弹窗的内容 父组件 自定义内容
            </div>

            <div
              className="footer-item"
              style={{
                height: '40px',
                lineHeight: '40px',
                margin: '0 auto',
                width: '300px'
              }}
            >
              {this.state.cancleTxt && (
                <div
                  className="cancle btn"
                  style={{
                    width: this.state.btnWidth,
                    borderRadius: this.state.btnBorderRadius
                  }}
                  onClick={this.onClose}
                >
                  {this.state.cancleTxt}
                </div>
              )}
              {this.state.confirmTxt && (
                <div
                  className="confirm btn"
                  style={{
                    width: this.state.btnWidth,
                    borderRadius: this.state.btnBorderRadius,
                    backgroundColor: '#409eff',
                    color: '#fff'
                  }}
                  onClick={this.props.onConfirm}
                >
                  {' '}
                  {this.state.confirmTxt}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Popup
