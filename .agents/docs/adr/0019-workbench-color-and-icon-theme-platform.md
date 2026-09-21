# ADR 0019: Workbench 配色与图标主题平台

- 状态：Accepted（图标选择与取色已后续修订）
- 日期：2026-08-22

## 决策

主题颜色只使用 `WORKBENCH_COLOR_REGISTRY` 的封闭语义键，宿主统一映射到 CSS 变量。图标使用独立的 `IconThemeContribution`，支持注册表、SVG 和 URL 资源；静态主题可以只交付 JSON。

封闭键集使主题覆盖范围可校验，避免任意 CSS 变量成为公共接口。字段定义见 `packages/core/src/types/contributions.ts` 与 `packages/core/src/theme/`。

## 后续决策

图标由所选配色主题派生，不保存独立偏好，见 [ADR 0026](0026-icon-theme-follows-color-scheme.md)。图片归宿主、配色算法归主题，见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。
