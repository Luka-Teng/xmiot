import React from 'react'
import style from './index.module.less'
class Pagination extends React.Component {
  constructor (props) {
    super(props)
    // 设置当前页码，默认为第一页
    this.state = {
      pageCurr: 1,
      groupCount: 7,
      startPage: 1,
      pageCount: 10
    }
  }

  // componentDidMount() {
  //     this.setState({
  //         pageCountEle:document.querySelector("#pageCount"),
  //     });

  //     setTimeout(()=>{
  //         document.addEventListener("click",(e)=>{
  //             if(e.target.id !== "pageCount"){
  //                 this.state.pageCountEle.parentNode.className = style.hide;
  //             }
  //         },false);
  //     },0)
  // }

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
          上一页
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
          下一页
        </li>
      )
    } else {
      pages.push(
        <li
          className={this.state.pageCurr === 1 ? style.nomore : ''}
          key={0}
          onClick={this.goPrev.bind(this)}
        >
          上一页
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
          下一页
        </li>
      )
    }
    return pages
  }

  // 更新 state
  go (pageCurr, reset = false) {
    const { groupCount } = this.state

    const { totalPage, paging } = this.props.config

    this.setState({
      pageCurr
    })

    // 处理下一页的情况
    if (pageCurr % groupCount === 1) {
      this.setState({
        startPage: pageCurr
      })
    }

    // 处理上一页的情况
    if (pageCurr % groupCount === 0) {
      this.setState({
        startPage: pageCurr - groupCount + 1
      })
    }

    // 点击最后两页的情况
    if (totalPage - pageCurr < 2) {
      this.setState({
        startPage: totalPage - groupCount
      })
    }

    // 选择每页条数后重新分页

    // if(reset === true){
    //     this.setState({
    //         pageCurr:1,
    //         startPage:1,
    //     });
    // }

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
    let { pageCurr, groupCount } = this.state

    const { totalPage } = this.props.config

    if (++pageCurr > totalPage) {
      return
    }

    this.go(pageCurr)
  }

  // // 选择每页条数
  // choosePageCount(e){
  //     const {
  //         pading
  //     } = this.props.config;
  //     const parentUI = this.state.pageCountEle.parentNode;
  //     parentUI.className = (parentUI.className === style.hide)?"":style.hide;
  // }

  // confirmPageCount(pageCount){
  //     const {
  //         pageCountEle,
  //         pageCurr,
  //     } = this.state;

  //     // 设置每页显示条数
  //     this.setState({
  //         pageCount
  //     });
  //     pageCountEle.innerHTML = pageCount;
  //     pageCountEle.parentNode.className = style.hide;

  //     setTimeout(()=>{
  //         this.go(pageCurr, true);
  //     },0);
  // }

  render () {
    const Pages = this.create.bind(this)()
    return (
      <div className={style.main}>
        {/* <div className = { style.bar }>
                    <span>每页显示</span>
                    <div className = { style.select }>
                        <ul className = { style.hide }>
                            <li id="pageCount" onClick = { this.choosePageCount.bind(this) }>10</li>
                            <li onClick = { this.confirmPageCount.bind(this,10) }>10</li>
                            <li onClick = { this.confirmPageCount.bind(this,20) }>20</li>
                            <li onClick = { this.confirmPageCount.bind(this,30) }>30</li>
                            <li onClick = { this.confirmPageCount.bind(this,50) }>50</li>
                        </ul>
                    </div>
                </div> */}
        <ul className={style.page}>{Pages}</ul>
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
  // async componentDidMount() {
  //     await setTimeout(()=>{
  //         new Promise((res)=>{
  //             this.setState({
  //                 renderPage:true
  //             })
  //         })
  //     },500)
  // }

  render () {
    // let data = {
    //               pageCurr:1,
    //               totalPage:21,
    //               async paging (obj) {
    //                   // let data = await fetch("http://www.baidu.com").then((res)=>res.json());
    //                   console.log('aaaaa')

    //               }
    //           }
    const a = { async b () {} }
    return (
      <article className={style.main}>
        {/* <Pagination config = {data}></Pagination> */}
        <div>11111</div>
      </article>
    )
  }
}
