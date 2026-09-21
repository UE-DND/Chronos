# ADR 0026: 图标主题由配色方案派生与独立偏好废弃

- 状态：Accepted（已合并 ADR 0043 修订）
- 日期：2026-08-24

## 决策

图标主题由当前配色主题的 `recommendedIconTheme` 派生，缺省使用 `host-default`。不保存 `visualIconThemeId`，不提供独立图标选择器；图标资源仍通过标准 JSON 管线交付。

## 取舍与演进

配色和图标一起选择，减少持久化状态与不协调组合。ADR 0041 曾规定壁纸取色时固定宿主图标，该例外已由 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 撤销：取色时也跟随所选主题，偏好和跨标签页同步触发刷新。
