# ADR 0030: 官方插件随宿主发版与启动时静默同步

- 状态：Accepted
- 日期：2026-08-31

## 决策

官方插件与 `apps/web/package.json` 版本一起发布，不维护独立兼容版本协商。Bundle、Manifest 和 Catalog 在 dev/build 时生成，不提交到版本库。

启动时先恢复可用缓存，再检查官方目录来源的安装记录；版本与宿主不一致时静默同步。更新只替换代码、样式和资源记录，保留插件私有数据；失败保留可用旧安装。外部 Manifest URL 不参与此同步。

## 取舍

统一发行降低版本组合数量，但要求官方插件与宿主协同构建。宿主 PWA 本身仍需用户确认更新，见 [ADR 0035](0035-pwa-manual-update-and-document-cache.md)；安装和回滚见 [ADR 0042](0042-unified-plugin-preinstallation.md)。
