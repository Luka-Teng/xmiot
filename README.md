#### 随手
1. lerna层不需要做eslint的检查，但是要做prettier的格式化。
2. eslit在各个包中做检查。

#### 包类型
1. 目前允许在packages项目中添加react组件和global全局包。
2. react组件采用es6的语法进行编写，只能export一个组件。
3. global全局包采用es6语法编写，能export多个方法。

#### 发版流程
-> 在根目录执行git的add， commit，push的操作。对于一个大版本的修改，需要打上对应tag。
-> 项目会自动的packages的代码进行prettier优化。
-> 根目录执行npm run publish进行npm库和git库的提交。
注意事项: 由于是协同作业，各个项目成员对他人项目进行修改时需要进行通知，并打上patch-tag，做好注释，以便回滚。

#### 包的测试环境调试
-> 根目录执行npm run start-prod/start-dev -- -p xx -e xx -t xx
-> start-prod, start-dev对应正式环境和测试环境
-> --必须写，后面才可以加参数
-> -p 必填，表示需要测试的包名
-> -e 非必填，包入口，默认是包下的src/index.js文件
-> -t 非必填，包类型，会被各个项目的package.json里的type覆盖 

#### 包的创建
-> 根目录执行npm run init dest(包目录)
-> 根据提示选择包名，包类型等
-> 完成自动加载依赖