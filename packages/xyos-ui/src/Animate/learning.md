#### rc-animation 核心库

##### css-amimation

```javascript
/**
 * node：dom节点
 * transitionName：动画名，会对应到css的某个class中
 * endCallback：动画结束后的回调
 */
const stop = cssAnimation(node, transitionName, endCallback)

// 调用该方法会使node节点经历三个阶段

1. start: 节点被加上'transitionName'的class，运行endCallback.start

2. active: 延迟30ms后，节点被加上'transitionName-active'的class，运行endCallBack.active

3. end: 'animation/transition'结束后，节点的'transitionName'和'transitionName-active'这两个class被去除，并运行endCallBack.end

可以执行 stop()，会强制进入end阶段
```

##### AnimateChild

```javascript
// 控制动画化基本组件，本质上是基于css-amimation的上层封装

// 该组件封装了三个调用动画的方法，和一个停止方法

1. componentWillAppear：绑定的css-name是 transitionName-appear 和 transitionName-appear-active

2. componentWillEnter：绑定的css-name是 transitionName-enter 和 transitionName-enter-active

3. componentWillLeave：绑定的css-name是 transitionName-leave 和 transitionName-leave-active

4. stopper: 终止动画

```

##### Animate

```javascript
// 用于调度子元素（AnimateChild）动画方法

Animate内部的子元素并不是通过props.children直接渲染出来，而是通过state.children去做管理，这样能保证在子元素增加和删除时能正确的被添加动画

1. showProps：Animate在元素hide和show的过程中会有两种识别模式
  
  a. 没有showProps的时候，会根据 currentChildren 和 nextChildren的对比，去判断那些元素进入appear，那些元素进入enter，那些元素进入leave

  b. 存在showProps的时候，会合并showProps进行判断，具体玩下看。

2. appear：当Animate被挂载的时候，每个子元素（如果存在showProps，则为true的子元素被调用）会被调用componentWillAppear

3. enter：当有新的子元素被添加的时候，会调用componentWillEnter

  ---如果存在showProps，调用该方法的子元素需满足一下任意一点：

  1. 为新元素，且showProps为true

  2. 为旧元素，且showProps变化为true

4. leave：当有子元素被移除的时候，会调用componentWillLeave

  ---如果存在showProps，调用该方法的子元素需满足一下任意一点：

  1. 子元素被删除

  2. 子元素showProps变化为false

5. 子元素的变化流程

  1. nextChildren 和 currentChildren 合并生成 newChildren

  2. newChildren生成需要遵守以下几点（保证元素的视觉更新）： 
    
    a. nextChildren和currentChildren中相同key的子元素，会被打入newChildren，如果存在showProps，存在一个为true，新元素就为true

    b. nextChildren新增的元素，currentChildren中被移除的元素也会被打入newChildren

  3. this.setState({children: newChildren})

  4. 将元素进行分类，分为enter和leave两组，分类标准为看上面的3-4

  5. enter执行componentWillEnter，leave执行componentWillLeave，开始动画的运行

  6. leave执行完毕后，会重新setState到nextChildren

```