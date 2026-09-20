# ADR 0044: 服务端插件定义与部署装配

- 状态：Accepted
- 日期：2026-09-20
- 修订：ADR 0042 的服务端模块、代理 action 和域名归属

## 决策

官方插件包通过 `./server` 导出服务端处理函数，通过无副作用的 `./server/definition` 导出 `serverDefinition`（`pluginId`、单个代理 `action`、`domains`）。客户端调用与服务端 `serverManifest` 引用同一份定义。构建器从官方目录定位插件包，读取包名与导出，验证定义并生成静态服务端导入及客户端可用 action 列表；正式与开发态市场 manifest 的 `optionalServerCapabilities` 也从该定义生成。缺失或不一致的声明使构建失败。

部署只声明启用的插件 ID。启用的服务端模块作为宿主构建依赖随发行包打包；未启用的模块不进入生成的服务端 loader，空部署不生成代理路由。客户端安装和卸载不会改变服务端部署。域名是插件申报与审查信息，不代表通用的出站网络限制。

## 影响

新增服务端插件需进入官方插件目录、提供两个包导出，并由目标宿主声明构建依赖及部署白名单；无需在宿主填写该插件的服务端导入路径、action 或域名。保留现有 `/api/plugins/{pluginId}/{action}` 与 `PluginServerResponse` 线协议。该调整不引入运行时上传或动态部署服务端代码。
