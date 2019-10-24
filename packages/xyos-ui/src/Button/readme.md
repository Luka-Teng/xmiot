## Button

|props| description                 |
|:----|:------------------|
|type | button 类型 ('default'（默认）,primary,ghost,dashed,danger'）
|size | button 大小 （normal，large ，small）|
|loading | button loading的状态 （boolean）|
|disabled| button 不可用的状态 （boolean）|

----

```
 <Button type="primary">
   Primary
 </Button>

  <Button type="primary" disabled>
    Primary(disabled)
  </Button>

  <Button type="primary" loading>
    加载
  </Button>

  <Button type="primary" size='small'>
    small(primary)
  </Button>

  <Button  size='small'>
    small
  </Button>
  
  <Button type="primary" size='large'>
    lg(primary)
  </Button>
```
