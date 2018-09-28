# 起步

## 开始

- 下载地址

`git clone https://github.com/keno-lee/memo-cli.git`

- 执行命令

`npm install`  安装依赖

`npm link`  写入全局命令

## lerna.js

- 定义：
  - Lerna 是一个用来优化托管在git\npm上的多package代码库的工作流的一个管理工具,可以让你在主项目下管理多个子项目，从而解决了多个包互相依赖，且发布时需要手动维护多个包的问题。
- 安装
  - `$ mkdir lerna-repo && cd $_`
  - `$ npx lerna init`
- 配置 lerna.json
  - `version: "independent"` - Independent mode 多包独立版本模式
  - `version: "0.0.1"` - Fixed/Locked mode(default) 统一管理模式


