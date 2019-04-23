### devServer负责xmiot测试环境的运行，抛弃了rollup拥抱webpack

### 架构
1. js, jsx, ts, tsx统一使用一套babel转义

2. 语法检测

  ts, tsx统一使用ForkTsCheckerWebpackPlugin进行语法检测
  
3. 代码风格检测

  a. 使用tslint进行代码风格检测

  b. js, jsx统一使用eslint进行代码风格检测

  c. 语法检测严格遵守eslint和tslint的层级，好处在于ide也能识别

### 注意事项

  包的代码不要混搭！！！！（严禁ts，js混合写法）

  默认的环境目录（eslint，tslint，tsChecker，主babel-loader的执行对象）是入口文件的所在目录  

### 命令行

  xmiot-server entry [options]

  -l, -language: ts / js

  -wrokDir: eslint，tslint，tsChecker，主babel-loader的执行目录，绝对路径，或者相对于cwd的相对路径