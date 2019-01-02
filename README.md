## 概览

#### 随手
1. lerna层不需要做eslint的检查，但是要做prettier的格式化。
2. eslit在各个包中做检查。

---

#### 包类型
1. 目前允许在packages项目中添加react组件和global全局包。
2. react组件采用es6的语法进行编写，只能export一个组件。
3. global全局包采用es6语法编写，能export多个方法。

---

### 包的更新
1. 目前gitlab上提供bug, enhancement两个label，对于中等以上的bug修复和功能增强使用issue去管理。
2. issue的完成要MR一个新的分支，需要创建一个新的分支去处理。
3. 后续的git管理会引入dev分支，所有的新功能需要从dev分支创建branch。
4. 对应的branch需进行单元测试和覆盖率测试，通过测试才可以合并到dev。
5. master分支和dev分支的合并看心情。

---

#### 发版检测流程（考虑删除）
>由于lerna发布存在失败的可能，如网络中断，手动修改版本号等，为了增加发布的安全性添加了发版检测。

命令行npm run publish

检测git连接，检测是否有未提交文件

检测npm是否登录，并将上次发布的commitid之后所有的修改过得包进行发版检测

##### TODO：鉴别本地版本号和npm库版本号是否一致，本地高则提醒手动发布，本地低则提醒版本号处理 
##### TODO: 判断包内是否有新的依赖，有则发布前加载依赖

lerna publish 发布

如果发布成功，记录发布后的commitid，并写入package.json，并且提交

---

#### 发版流程
在根目录执行git的add， commit，push的操作。对于一个大版本的修改，需要打上对应tag。

项目会自动的packages的代码进行prettier优化。

根目录执行npm run publish进行npm库和git库的提交。

>注意事项: 由于是协同作业，各个项目成员对他人项目进行修改时需要进行通知，并打上patch-tag，做好注释，以便回滚。

---

#### 包的测试环境调试
根目录执行npm run start-prod/start-dev packageName -- -e xx -t xx

start-prod, start-dev对应正式环境和测试环境

-- 如需写参数则必须写

-e 非必填，包入口，默认是包下的src/index.js文件

-t 非必填，包类型，会被各个项目的package.json里的type覆盖 

---

#### 包的创建
根目录执行npm run init dest(包目录)

根据提示选择包名，包类型等

完成自动加载依赖

---

#### 环境变量的配置
如果报的开发需要加入其他的环境变量，可以自行在(package.json)命令行中另起一行添加。

默认环境变量NODE_ENV, API_ENV。

后续环境变量添加规则要以XMIOT_开头，否则测试过程无法被识别。

---

#### 注意事项
最好不要再各个项目内添加eslint-ignore，防止提交代码时候的优化遗漏。

运行start时候，如果有依赖包最好先运行一遍 npm run bootstrap 来更新。

lerna发布分为两步
  1. 给本次commit打上对应tag，并提交到仓库。
  2. 将对应本次commit的包发布至npm
  因此如果第一步出错，需要手动回退commit
  如果第二步错，需要checkout 修改后，自己进入每个包进行npm publish

---

## 目前拥有的包

### xmiot-function 
> 集成了 常用的方法 比如：获取参数，本地存储，日期格式转换 等等。具体的方法 详情参考 包里面的使用说明。

### xmiot-net
> axios的增强包，用于扩展axios的功能。

### xmiot-record
> react高阶录音组件

### xmiot-pagination
> react 分页组件

### xmiot-cli
> react项目脚手架搭建