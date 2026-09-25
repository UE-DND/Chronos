# ADR 0030：官方插件版本与宿主同步

- 状态：Accepted
- 日期：2026-08-31

## 决策

官方插件和 `apps/web/package.json` 使用同一版本发布，不单独协商兼容版本。Bundle、Manifest 和 Catalog 在 dev/build 时生成，不提交到版本库。

启动时先恢复可用缓存，再检查来自官方目录的安装记录。插件版本和宿主不一致时，系统会静默同步。更新只替换代码、样式和资源记录，并保留插件私有数据。更新失败时继续使用可用的旧安装。外部 Manifest URL 不参与同步。

## 取舍

统一发行减少了版本组合，但要求官方插件和宿主一起构建。宿主 PWA 仍需用户确认更新，见 [ADR 0035](0035-pwa-manual-update-and-document-cache.md)。安装和回滚见 [ADR 0042](0042-unified-plugin-preinstallation.md)。
