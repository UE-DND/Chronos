# ADR 0025: 官方插件安装模块拆分与服务端代理契约

- 状态：Accepted
- 日期：2026-08-23

## 决策

`OfficialPluginService` 对外管理安装生命周期，内部将目录读取、资源校验、安装记录和运行时激活分给 `OfficialPluginCatalogClient`、`OfficialPluginAssetPipeline`、`OfficialPluginInstalledStore` 和 `OfficialPluginRuntimeActivator`。事务编排留在服务层，子模块隐藏各自 I/O 细节。

服务端代理使用 core 的 `PluginServerResponse<T>`：成功为 `{ ok: true, payload }`，失败为 `{ ok: false, error }`。`IHttpService.proxy` 返回 HTTP 响应，业务信封在 body 中解析；插件内部错误在 handler 边界转换。

## 取舍

安装 I/O 可分别测试，客户端与 handler 共用线协议。预安装和替换回滚见 [ADR 0042](0042-unified-plugin-preinstallation.md)，服务端声明与部署见 [ADR 0044](0044-server-plugin-definition-and-deployment-assembly.md)。
