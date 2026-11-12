# ADR 0046：插件声明式移动端代理分发

- 日期：2026-09-26
- 修订：ADR 0044 的 Android 原生服务端代理执行边界

## 决策

官方插件可以额外导出 `./mobile` 和 `./mobile/definition`。定义里写明插件 ID、原生 handler 的 action，以及需要清理 Cookie 的 HTTPS origins。构建器从官方插件目录发现这些导出，核对 ID、action、上游域名和 Cookie 来源，然后生成静态的 handler 注册表。构建产物直接导入所选插件的 handler。声明重复、缺失或不一致时，构建失败。新的原生代理插件仍按现有流程放进官方插件目录，不必再改移动端的路由分支。

移动端 handler 返回已有的 `PluginServerResponse`，业务逻辑留在插件里。handler 通过与平台无关的 `MobilePluginServerContext` 申请受限的 `IHostHttpSession`。Capacitor 宿主实现这个 session，包括 HTTPS 和域名限制、Cookie 是否还在的查询、请求超时，以及释放时清理 Cookie。插件的 handler 不依赖 Capacitor。移动端 adapter 按静态注册表分发。Profile 策略先看这个 action 允不允许。策略禁止的请求直接拒绝；没注册、也没被禁止的请求，才交给内层的 `IHttpService`。

`IHttpService`、服务端插件的线协议和 `HostPlatformAdapter` 保持不变。静态注册表里只有跟着这份 APK 一起构建的原生 handler。在线下载的 ESM 插件不能注册或执行新的原生 handler，也不能因此拿到任意域名的网络访问。

## 影响

只有真的提供了原生代理实现的插件才导出 `./mobile`。没有原生实现的插件不进注册表。移动端的网络实现由插件包和宿主的 session 接口配合完成，不在宿主 adapter 里按学校或 action 写胶水分支。业务逻辑继续复用插件已有的实现。平台 session 的契约不够用时，扩展通用接口，而不是让插件去导入 Capacitor API。
