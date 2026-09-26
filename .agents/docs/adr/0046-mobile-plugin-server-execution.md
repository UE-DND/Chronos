# ADR 0046：插件声明式移动端代理分发

- 状态：Accepted
- 日期：2026-09-26
- 修订：ADR 0044 的 Android 原生服务端代理执行边界

## 决策

官方插件可选导出 `./mobile` 与 `./mobile/definition`。定义声明插件 ID、原生 handler action 和需要清理 Cookie 的 HTTPS origins。构建器从官方插件目录发现这些导出，校验 ID、action、上游域名和 Cookie 来源，并生成静态 handler 注册表。构建产物直接导入所选插件的 handler；重复、缺失或不匹配的声明使构建失败。新增原生代理插件仍需按现有流程加入官方插件目录，不需要修改移动端路由分支。

移动端 handler 返回既有 `PluginServerResponse`，业务逻辑由插件拥有。handler 通过平台无关的 `MobilePluginServerContext` 请求受限的 `IHostHttpSession`。Capacitor 宿主实现该 session，包括 HTTPS 与域名约束、Cookie 存在性查询、请求超时和释放时清理 Cookie。插件 handler 不依赖 Capacitor。移动端 adapter 按静态注册表分发；未注册的代理请求继续交由内层 `IHttpService`。

`IHttpService`、服务端插件线协议与 `HostPlatformAdapter` 保持不变。静态注册表只包含随 APK 构建的原生 handler。在线下载的 ESM 插件不能注册或执行新的原生 handler，也不能获得任意域名网络访问能力。

## 影响

只有提供原生代理实现的插件才声明 `./mobile`。无原生实现的插件不进入注册表。移动端网络实现由插件包与宿主 session 接口协作，不在宿主 adapter 中按学校或 action 编写胶水分支。业务逻辑继续复用插件已有实现；当平台 session 契约不足时，应扩展通用接口，而不是让插件导入 Capacitor API。
