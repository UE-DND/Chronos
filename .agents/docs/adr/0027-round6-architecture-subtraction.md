# ADR 0027：引擎接口与插件定义

- 日期：2026-08-24

## 决策

宿主直接调用引擎方法。插件通过受控的 `ctx.actions` 调用业务操作。删除只负责转发的 `engine.actions` 和未使用的端口。

`defineChronosPlugin` 统一处理插件元数据和消息注册。导入临时状态集中放在 `transfer-state`，不再分散到组件中。

颜色契约使用封闭的语义键，见 [ADR 0019](0019-workbench-color-and-icon-theme-platform.md)。宿主 `hostT` 和插件消息目录的当前分工已合并到 [ADR 0024](0024-plugin-message-catalog-i18n.md)。

## 取舍

保留负责隔离的上下文，删除没有独立职责的转发层。本轮的具体清理记录保存在 Git 历史中。
