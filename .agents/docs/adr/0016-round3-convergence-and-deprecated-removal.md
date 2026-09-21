# ADR 0016: Round 3 架构收敛 — 废弃接口清零、泛化动态色彩契约与运行时实例隔离

- 状态：Superseded（动态配色见 ADR 0043）
- 日期：2026-08-22

## 历史决策

本轮删除旧接口别名，并将壁纸事件泛化为 `dynamicColor:*`，尝试让多个主题复用取色广播。

广播与壁纸插件现已移除：宿主拥有图片生命周期，主题提供配色算法，见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md) 和 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。未发布阶段的数据契约以根目录 `AGENTS.md` 为准。
