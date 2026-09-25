# ADR 0025：插件安装模块与服务端代理契约

- 状态：Accepted
- 日期：2026-08-23

## 决策

`OfficialPluginService` 对外管理安装生命周期。它将目录读取、资源校验、安装记录和运行时激活交给 `OfficialPluginCatalogClient`、`OfficialPluginAssetPipeline`、`OfficialPluginInstalledStore` 和 `OfficialPluginRuntimeActivator`。服务层负责协调事务。各子模块隐藏自己的 I/O 细节。

服务端代理使用 `core` 的 `PluginServerResponse<T>`。成功响应为 `{ ok: true, payload }`，失败响应为 `{ ok: false, error }`。`IHttpService.proxy` 返回 HTTP 响应，调用方从 body 解析业务信封。插件内部错误在 handler 边界转换。

## 取舍

安装 I/O 可以分别测试，客户端和 handler 共用同一线协议。预安装和替换回滚见 [ADR 0042](0042-unified-plugin-preinstallation.md)，服务端声明和部署见 [ADR 0044](0044-server-plugin-definition-and-deployment-assembly.md)。
