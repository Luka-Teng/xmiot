import React from 'react'
import classnames from 'classnames'
import './index.less'
class Popup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      //   show: true,
      //   title: '这是一个title', // 头部title
      //   subtitle: '这是一个副标题', // 头部副标题
      //   isShowLeft: true, // 是否显示 header 左边
      //   isShowRight: true,
      //   isShowHeader: false, // 是否显示 弹窗的头部 如果传了 title 默认显示title
      //   cancleTxt: '取消',
      //   confirmTxt: '确定',
      //   btnWidth: '120px',
      //   btnBorderRadius: '7px'
    }
  }

  /**
   * 需要 穿的props：
   * style  弹窗样式
   * onClose  关闭弹窗 调用的方法
   * show 弹窗显示的状态
   *  isShowHeader 是否显示 弹窗的头部
   * title 弹窗 头部的标题
   * subtitle 头部 副标题
   * isShowLeft 是否显示头部 左边的操作
   * isShowRight  是否显示 头部右侧关闭按钮
   * headerStyle 自定义头部样式
   * footerStyle 自定义底部按钮的样式
   * btnStyle 自定义 按钮的样式
   * confirmTxt 确认 按钮的文案 （默认是确认）
   * cancleTxt 取消按钮的文案 （默认是取消）
   * onConfirm 点击确认按钮的 方法
   *
   *
   */

  componentDidMount () {
    console.log('挂在完成')
  }

  render () {
    let props = this.props
    let classes = classnames('xmiot-popup-wrap', { show: props.show })
    let headerClass = classnames(
      'header-wrap',
      { showheader: props.isShowHeader || props.title },
      { onlyLeft: !props.title && props.isShowRight }
    )

    return (
      <div className={classes}>
        <div className="mask" onClick={props.onClose} />
        <div className="xmiot-popup-container" style={props.style}>
          <div className="content-container">
            <div className={headerClass}>
              <div className="header-item" style={props.headerStyle}>
                {props.isShowLeft && <span className="left-icon">返回</span>}
                {props.title && (
                  <div className="header-title">
                    <p className="title">{props.title}</p>
                    <p className="subtitle">{props.subtitle}</p>
                  </div>
                )}
                {props.isShowRight && (
                  <span className="right-icon" onClick={props.onClose}>
                    X
                  </span>
                )}
              </div>
            </div>
            <div
              className="content-item"
              style={{ height: '300px', textAlign: 'center' }}
            >
              {this.props.children}
            </div>

            <div className="footer-item" style={props.footerStyle}>
              {props.cancleTxt && (
                <div
                  className="cancle btn"
                  style={props.btnStyle}
                  onClick={props.onClose}
                >
                  {props.cancleTxt}
                </div>
              )}
              {props.confirmTxt && (
                <div
                  className="confirm btn"
                  style={props.btnStyle}
                  onClick={this.props.onConfirm}
                >
                  {props.confirmTxt}
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
