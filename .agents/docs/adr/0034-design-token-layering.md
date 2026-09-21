# ADR 0034: 设计 Token 分层与命名规范

- 状态：Accepted（颜色来源由 ADR 0043 修订）
- 日期：2026-08-29

## 决策

Token 按颜色、排版、圆角、布局和组件模式分层。排版类使用 `text-*`，组件模式使用 `ui-*`，不以 `m3-*` 暗示所有组件都遵循 Material 规范。

颜色键及 Tailwind 映射属于公共契约；颜色值和算法属于主题。首屏 CSS 从 Profile 默认主题生成，旧 `CHRONOS_HOST_COLORS` 方案已被 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 取代。

修改位置和样式规则见 [设计 Token](../../../docs/design-tokens.md)，不在 ADR 复制 Token 数值。

## 取舍

样式消费者依赖语义键，主题能替换颜色实现；生成产物需由其来源重新生成。
