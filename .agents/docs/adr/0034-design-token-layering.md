# ADR 0034：设计 Token 分层

- 状态：Accepted（颜色来源由 ADR 0043 修订）
- 日期：2026-08-29

## 决策

Token 按颜色、排版、圆角、布局和组件模式分层。排版 Token 使用 `text-*`，组件模式 Token 使用 `ui-*`。不使用 `m3-*`，以免让人误以为所有组件都遵循 Material 规范。

颜色键和 Tailwind 映射属于公共契约。颜色值和算法由主题管理。首屏 CSS 根据 Profile 默认主题生成。旧的 `CHRONOS_HOST_COLORS` 方案已由 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 取代。

修改位置和样式规则见[设计 Token](../../../docs/design-tokens.md)。本记录不复制 Token 数值。

## 取舍

样式代码依赖语义键，主题可以替换颜色实现。生成产物必须从源文件重新生成。
