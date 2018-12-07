import React from 'react'
import style from './index.module.less'
class Pagination extends React.Component {
  constructor (props) {
    super(props)
    // 设置当前页码，默认为第一页
    this.state = {
      pageCurr: 1, // 当前页
      groupCount: 7, // ...前页码tap数
      startPage: 1, // 左侧第一个页码
      pageCount: 10, // 一排tap的总数
      hide: true, // 是否显示每页条数的下拉框
      perPageNum: 10, // 选中的下拉框的内容
      inputPage: ''
    }
  }

  componentDidMount () {
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
    console.log('fffffff', this.state.inputPage)
    this.go(this.state.inputPage)
  }
  create () {
    const { totalPage } = this.props.config

    const { pageCurr, groupCount, startPage } = this.state

    let pages = []
    if (totalPage <= 10) {
      pages.push(
        <li
          onClick={this.goPrev.bind(this)}
          className={this.state.pageCurr === 1 ? style.nomore : ''}
          key={0}
        >
          &lt;
        </li>
      )
      for (let i = 1; i <= totalPage; i++) {
        // 点击页码时调用 go 方法，根据 state 判断是否应用 active 样式
        pages.push(
          <li
            onClick={this.go.bind(this, i)}
            className={pageCurr === i ? style.active : ''}
            key={i}
          >
            {i}
          </li>
        )
      }
      pages.push(
        <li
          onClick={this.goNext.bind(this)}
          className={this.state.pageCurr === totalPage ? style.nomore : ''}
          key={totalPage + 1}
        >
          &gt;
        </li>
      )
    } else {
      pages.push(
        <li
          className={this.state.pageCurr === 1 ? style.nomore : ''}
          key={0}
          onClick={this.goPrev.bind(this)}
        >
          &lt;
        </li>
      )
      for (let i = startPage; i < groupCount + startPage; i++) {
        if (i <= totalPage - 2) {
          pages.push(
            <li
              className={this.state.pageCurr === i ? style.active : ''}
              key={i}
              onClick={this.go.bind(this, i)}
            >
              {i}
            </li>
          )
        }
      }

      // 分页中间的省略号
      if (totalPage - startPage >= 9) {
        pages.push(
          <li className={style.ellipsis} key={-1}>
            ···
          </li>
        )
      }
      // 倒数第一、第二页
      pages.push(
        <li
          className={this.state.pageCurr === totalPage - 1 ? style.active : ''}
          key={totalPage - 1}
          onClick={this.go.bind(this, totalPage - 1)}
        >
          {totalPage - 1}
        </li>
      )
      pages.push(
        <li
          className={this.state.pageCurr === totalPage ? style.active : ''}
          key={totalPage}
          onClick={this.go.bind(this, totalPage)}
        >
          {totalPage}
        </li>
      )

      // 下一页
      pages.push(
        <li
          className={this.state.pageCurr === totalPage ? style.nomore : ''}
          key={totalPage + 1}
          onClick={this.goNext.bind(this)}
        >
          &gt;
        </li>
      )
    }
    return pages
  }

  // 更新 state
  go (pageCurr, click = true) {
    const { groupCount } = this.state

    const { totalPage, paging } = this.props.config

    this.setState({
      pageCurr
    })
    // if (click) {

    // }
    // 处理下一页的情况
    if (pageCurr % groupCount === 1) {
      this.setState({
        startPage: pageCurr
      })
    } else if (pageCurr % groupCount === 0) {
      // 处理上一页的情况
      this.setState({
        startPage: pageCurr - groupCount + 1
      })
    } else if (totalPage - pageCurr < 2) {
      // 点击最后两页的情况
      this.setState({
        startPage: totalPage - groupCount
      })
    }

    // 选择每页条数后重新分页

    setTimeout(() => {
      paging({
        pageCurr: this.state.pageCurr,
        pageCount: this.state.pageCount
      })
    })
  }

  // 页面向前
  goPrev () {
    let { pageCurr } = this.state

    if (--pageCurr === 0) {
      return
    }

    this.go(pageCurr)
  }
  // 页面向后
  goNext () {
    let { pageCurr } = this.state

    const { totalPage } = this.props.config

    if (++pageCurr > totalPage) {
      return
    }

    this.go(pageCurr)
  }

  // 选择每页条数
  choosePageCount (e) {
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
      perPageNum: pageCount,
      pageCurr: 1,
      startPage: 1
    })
    this.go(1)
  }

  render () {
    const Pages = this.create.bind(this)()
    return (
      <div className={style.main}>
        <div className={style.bar}>
          <span>每页显示</span>
          <div className={style.select}>
            <ul className={this.state.hide ? style.hide : ''}>
              <li
                ref={this.pageCountEle}
                id="pageCount"
                onClick={this.choosePageCount.bind(this)}
              >
                {this.state.perPageNum}
              </li>
              <li onClick={this.confirmPageCount.bind(this, 10)}>10</li>
              <li onClick={this.confirmPageCount.bind(this, 20)}>20</li>
              <li onClick={this.confirmPageCount.bind(this, 30)}>30</li>
              <li onClick={this.confirmPageCount.bind(this, 50)}>50</li>
            </ul>
          </div>
        </div>
        <ul className={style.page}>{Pages}</ul>
        <div>
          前往{' '}
          <input
            type="text"
            value={this.inputPage}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
          />{' '}
          页
        </div>
      </div>
    )
  }
}

export default class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      renderPage: false
    }
  }
  async componentDidMount () {
    await setTimeout(() => {
      new Promise(res => {
        this.setState({
          renderPage: true
        })
      })
    }, 500)
  }

  render () {
    let data = {
      pageCurr: 1,
      totalPage: 32,
      paging (obj) {
        console.log(obj)
      }
    }
    return (
      <article className={style.main}>
        <Pagination config={data} />
      </article>
    )
  }
}
