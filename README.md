### XMIOT架构图

#### server 运行

根目录下运行

```s
npm run server 入口文件（相对于更目录）
```

#### 注意事项

1. 目前的构建十分不友好，回将runtime打包进去（使用了react-app去处理），后期会脱离react-app独立去配置

2. 每个库的配置都要写好external，一定要写

![xmiot](./xmiot.png)
  
