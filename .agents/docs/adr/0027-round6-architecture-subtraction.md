# ADR 0027: Round 6 架构精简 — 颜色契约、内核接口瘦身、宿主国际化与插件工厂化

- 状态：Accepted
- 日期：2026-08-24

## 决策

宿主直接调用引擎方法，插件通过受控的 `ctx.actions` 调用业务动作。移除只有转发作用的 `engine.actions` 与未使用端口。

`defineChronosPlugin` 集中处理元数据和消息注册；导入临时状态集中在 `transfer-state`，不散落到组件。

颜色契约使用封闭语义键，见 [ADR 0019](0019-workbench-color-and-icon-theme-platform.md)；宿主 `hostT` 与插件 catalog 的当前分工已合并到 [ADR 0024](0024-plugin-message-catalog-i18n.md)。

## 取舍

保留有隔离职责的上下文，删除没有独立职责的透传层。本轮清理明细由 Git 历史保存。
