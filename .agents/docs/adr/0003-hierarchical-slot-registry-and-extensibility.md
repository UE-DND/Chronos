# ADR 0003: 分层插槽树与声明式扩展机制 (Hierarchical Slot Registry)

- 状态：Accepted
- 日期：2026-08-19

## 决策

插件在 `apply(ctx)` 中按点分路径注册贡献，例如 `import.source.tab` 和 `shell.bottom-bar.tab`。宿主消费能力契约，不按插件 ID 分派业务。

注册表记录贡献的所有者，插件释放时撤销注册。同一槽位支持多个贡献；同 ID 后注册者覆盖先注册者，旧注册的清理不能删除新贡献。消费规则见 [ADR 0021](0021-slot-consumption-seam.md)。

简单配置由 `SchemaForm` 渲染，复杂交互使用 `ChronosMountable`。标准槽位与字段以 `packages/core/src/types/slots.ts` 为准。

## 取舍

新增插件可以复用现有宿主出口；新增扩展能力仍需定义贡献契约、冲突策略和消费点。
