# ADR 0026：图标主题跟随配色主题

- 日期：2026-08-24

## 决策

图标主题由当前配色主题的 `recommendedIconTheme` 决定。未指定时使用 `host-default`。系统不保存 `visualIconThemeId`，也不提供单独的图标选择器。图标资源仍通过标准 JSON 流程交付。

## 取舍与演进

配色主题和图标一起选择，减少持久化状态，也避免出现不协调的组合。ADR 0041 曾规定壁纸取色时固定使用宿主图标。该例外已由 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 撤销。取色时也使用所选主题的图标，偏好变化和跨标签页同步都会触发刷新。
