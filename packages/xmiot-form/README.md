兜底原则：
在参数传递过程中，对于某个参数的缺失需要在最终使用其参数的函数中进行兜底（默认值）

typescript infer使用技巧
```
type ElementOf<T> = T extends Array<infer E> ? E : never

type TTuple = [string, number];

type ToUnion = ElementOf<TTuple>;
```

typescript extends
```
再类型中extends表示是否能赋值
T extends U ? X : Y 表示如果T能赋值给U则类型为X，否则Y

作为*泛型参数*时，如果T是union类型，则会被被分解进行比对：

type NonNullable<T> = T extends null | undefined ? never : T;

type NonNullable<'1' | '2'>

会被分解为

'1' extends null | undefined ? never : T | '2' extends null | undefined ? never : T
```