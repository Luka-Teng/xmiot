### devServer负责xmiot测试环境的运行，抛弃了rollup拥抱webpack

### 架构
1. js, jsx, ts, tsx统一使用一套babel转义

2. 语法检测

  ts, tsx统一使用ForkTsCheckerWebpackPlugin进行语法检测
  
3. 代码风格检测

  a. 使用tslint进行代码风格检测

  b. js, jsx统一使用eslint进行代码风格检测

  c. 语法检测严格遵守eslint和tslint的层级，好处在于ide也能识别
  