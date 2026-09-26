# ADR 0019：Workbench 颜色与图标主题

- 日期：2026-08-22

## 决策

主题颜色只能使用 `WORKBENCH_COLOR_REGISTRY` 中定义的语义键。宿主统一将这些键映射到 CSS 变量。图标通过独立的 `IconThemeContribution` 提供，支持注册表、SVG 和 URL 资源。静态主题可以只交付 JSON。

封闭的键集让宿主可以校验主题覆盖范围，也避免把任意 CSS 变量变成公共接口。字段定义见 `packages/core/src/types/contributions.ts` 和 `packages/core/src/theme/`。

## 后续决策

图标由所选配色主题决定，不单独保存图标偏好，见 [ADR 0026](0026-icon-theme-follows-color-scheme.md)。图片由宿主管理，配色算法由主题实现，见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。
