# ADR 0010：宿主状态与主题职责

- 状态：Accepted（装配与壁纸存储已后续修订）
- 日期：2026-08-21

## 决策

视图通过 `ReactiveChronosController` 读取引擎状态。`AppShellController` 只保存宿主交互状态。删除重复的 `AppState`，避免两份状态相互同步。只有编辑草稿和领域模型含义不同时，才单独定义草稿类型。

主题回退由引擎能力处理。插件管理服务不反向依赖宿主外观实现。

## 后续决策

早期关于删除壁纸表和简化 Profile 注册的实现已不再适用。插件 KV 见 [ADR 0036](0036-plugin-kv-binary-storage.md)，宿主图片见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md)，统一预安装见 [ADR 0042](0042-unified-plugin-preinstallation.md)。
