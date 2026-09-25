# ADR 0016：旧接口清理与动态配色尝试（已取代）

- 状态：Superseded（动态配色见 ADR 0043）
- 日期：2026-08-22

## 历史决策

本轮删除了旧接口别名，并将壁纸事件改成通用的 `dynamicColor:*` 事件，尝试让多个主题共用取色广播。

广播和壁纸插件现已移除。宿主管理图片生命周期，主题提供配色算法，见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md) 和 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。未发布阶段的数据契约见根目录 `AGENTS.md`。
