# xmiot-pagination
React 分页组件
### props参数 config { totalPage: num,  groupCount: num, hasJumper: boolean, hasPageCount: boolean, paging: func}
* totalPage： 总页数
* groupCount： 页码按钮的数量，当总页数超过该值时会折。可选值为大于等于 5 且小于等于 21 的奇数
* paging ： 当页码以及每页显示条数改变时触发
* hasJumper： 跳刀某页模块
* hasPageCount：每页多少条模块
	* 回调参数： {pageCurr: num,  pageCount: num}, pageCurr当前页，pageCount每页条数