# ADR 0010: 宿主状态精简、消除双轨实现与统一契约规范

- 状态：Accepted（装配与壁纸存储已后续修订）
- 日期：2026-08-21

## 决策

视图通过 `ReactiveChronosController` 读取引擎状态，`AppShellController` 只持有宿主交互状态。删除重复的 `AppState`，避免双向同步。编辑草稿仅在与领域模型语义不同处单独定义。

主题回退通过引擎能力完成，插件管理服务不反向引用宿主外观实现。

## 后续决策

早期删除壁纸表、收敛 Profile 注册的实现不再是当前架构：插件 KV 见 [ADR 0036](0036-plugin-kv-binary-storage.md)，宿主图片见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md)，统一预安装见 [ADR 0042](0042-unified-plugin-preinstallation.md)。
