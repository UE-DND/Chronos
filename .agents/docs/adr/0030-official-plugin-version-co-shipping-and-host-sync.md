# ADR 0030：官方插件版本与宿主同步

- 日期：2026-08-31

## 决策

官方插件和 `apps/web/package.json` 使用同一版本发布，不单独协商兼容版本。Bundle、Manifest 和 Catalog 在 dev/build 时生成，不提交到源码分支。正式产物保存到 `codex/plugin-dist`，按版本发布到 Pages，见 [ADR 0045](0045-versioned-online-plugin-distribution.md)。

宿主只执行与当前版本匹配的官方插件。Profile 必需插件从内置目录恢复，可选插件从固定宿主版本的在线目录获取。替换代码时保留插件配置、数据和启用意图。

Web 更新会先准备目标插件，再授权目标 Worker 接管。APK 先更新应用，新宿主启动后恢复必需插件，并在后台更新可选插件。下载失败时保留数据及启用意图，暂停执行不兼容的旧代码。同宿主内的替换失败仍可回滚兼容运行时。

第三方插件不参与官方同步。宿主版本变化后，用户需要手动重新启用。以上行为由 [ADR 0047](0047-host-update-transactions.md) 修订。

## 取舍

统一发行减少了版本组合，但要求官方插件和宿主一起构建。一起发行不代表全量资源一起进入宿主：只有 Profile 必需插件随包，其他插件按需下载。宿主 PWA 仍需用户确认更新。早期缓存方案见 [ADR 0035](0035-pwa-manual-update-and-document-cache.md)，当前更新事务见 [ADR 0047](0047-host-update-transactions.md)。
