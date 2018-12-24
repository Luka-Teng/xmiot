import React from 'react'
import './index.less'
export default class Pagination extends React.Component {
  constructor (props) {
    super(props)
    // 设置当前页码，默认为第一页
    this.state = {
      pageCurr: 1, // 当前页
      groupCount: 7,
      startPage: 2, // 从第二页开始
      pageCount: 10, // 一排页码tap的总数
      hide: true, // 是否显示每页条数的下拉框
      inputPage: '',
      ellipsisAhead: false, // 前省略号
      ellipsisBehind: false, // 后省略后
      pages: []
    }
  }

  componentDidMount () {
    // console.log('tag', this.props.config)
    const { totalPage, groupCount } = this.props.config || {}
    this.setState({ totalPage: totalPage, groupCount: groupCount || 7 }, () => {
      this.go(1)
    })
    document.addEventListener(
      'click',
      e => {
        if (e.target.id !== 'pageCount') {
          this.setState({
            hide: true
          })
        }
      },
      false
    )
  }
  handleChange = event => {
    let page = Number(+event.target.value)
    if (!page) return
    if (page < 1) page = 1
    if (page > this.state.totalPage) page = this.state.totalPage
    this.setState({ inputPage: page })
  }
  handleBlur = () => {
    this.go(this.state.inputPage)
  }
  create () {
    const { pageCurr, groupCount, startPage, totalPage } = this.state
    let start = startPage
    let maxPage = groupCount - 1
    let bigMiddlePage = Math.ceil((groupCount - 2) / 2)
    let smallMiddlePage = Math.floor((groupCount - 2) / 2)
    if (pageCurr - bigMiddlePage >= 2) {
      this.setState({ ellipsisAhead: true })
      start = pageCurr - smallMiddlePage
      maxPage = pageCurr + smallMiddlePage
    } else {
      this.setState({ ellipsisAhead: false })
    }
    if (totalPage - pageCurr <= bigMiddlePage) {
      this.setState({ ellipsisBehind: false })
      start = totalPage - groupCount + 2
      maxPage = totalPage - 1
    } else {
      this.setState({ ellipsisBehind: true })
    }
    let pages = []
    for (let i = start; i <= maxPage; i++) {
      pages.push(
        <li
          className={pageCurr === i ? 'active' : ''}
          key={i}
          onClick={this.go.bind(this, i)}
        >
          {i}
        </li>
      )
    }
    this.setState({ pages })
  }

  // 更新 state
  go (pageCurr) {
    const { paging } = this.props.config
    this.setState(
      {
        pageCurr
      },
      () => {
        this.create()
        // 选择每页条数后重新分页
        paging({
          pageCurr: this.state.pageCurr,
          pageCount: this.state.pageCount
        })
      }
    )
  }
  // 点击向左
  goLeft = () => {
    let jumpNum = this.state.pageCurr - this.state.groupCount + 2
    if (jumpNum <= 1) jumpNum = 1
    this.go(jumpNum)
  }
  // 点击向右
  goRight = () => {
    let jumpNum = this.state.pageCurr + this.state.groupCount - 2
    if (jumpNum >= this.state.totalPage) jumpNum = this.state.totalPage
    this.go(jumpNum)
  }

  // 页面向前
  goPrev = () => {
    let { pageCurr } = this.state

    if (--pageCurr === 0) {
      return
    }

    this.go(pageCurr)
  }
  // 页面向后
  goNext = () => {
    let { pageCurr } = this.state

    const { totalPage } = this.props.config || 0

    if (++pageCurr > totalPage) {
      return
    }

    this.go(pageCurr)
  }

  // 选择每页条数
  choosePageCount = e => {
    this.setState({
      hide: !this.state.hide
    })
  }

  confirmPageCount (pageCount) {
    // 设置每页显示条数
    if (pageCount === +this.state.pageCount) return
    this.setState({
      pageCount,
      hide: true,
      pageCurr: 1,
      startPage: 2
    })
    this.go(1)
  }

  render () {
    const {
      totalPage,
      pageCurr,
      ellipsisAhead,
      ellipsisBehind,
      hide,
      pageCount
    } = this.state
    return (
      <div className={'main'}>
        <div
          style={{ display: this.props.display ? 'block' : 'none' }}
          className={'select'}
          id="pageCount"
          onClick={this.choosePageCount}
        >
          {pageCount}
          条/页
          <ul className={hide ? 'hide' : ''}>
            <li onClick={this.confirmPageCount.bind(this, 10)}>10条/页</li>
            <li onClick={this.confirmPageCount.bind(this, 20)}>20条/页</li>
            <li onClick={this.confirmPageCount.bind(this, 30)}>30条/页</li>
            <li onClick={this.confirmPageCount.bind(this, 40)}>40条/页</li>
            <li onClick={this.confirmPageCount.bind(this, 50)}>50条/页</li>
          </ul>
        </div>
        <ul className={'page'}>
          <li
            className={pageCurr === 1 ? 'nomore' : ''}
            key={0}
            onClick={this.goPrev}
          >
            &lt;
          </li>
          <li
            className={pageCurr === 1 ? 'active' : ''}
            key={1}
            onClick={this.go.bind(this, 1)}
          >
            {1}
          </li>
          <li
            className="ellipsis left"
            key={-1}
            style={{ display: ellipsisAhead ? 'block' : 'none' }}
            onClick={this.goLeft}
          />
          {this.state.pages}
          <li
            className="ellipsis right"
            key={-2}
            style={{ display: ellipsisBehind ? 'block' : 'none' }}
            onClick={this.goRight}
          />
          <li
            className={pageCurr === totalPage ? 'active' : ''}
            key={totalPage}
            onClick={this.go.bind(this, totalPage)}
          >
            {totalPage}
          </li>
          <li
            className={pageCurr === totalPage ? 'nomore' : ''}
            key={totalPage + 1}
            onClick={this.goNext}
          >
            &gt;
          </li>
        </ul>
        <div className={'jump'}>
          前往
          <input
            type="text"
            value={this.inputPage}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />
          页
        </div>
      </div>
    )
  }
}
