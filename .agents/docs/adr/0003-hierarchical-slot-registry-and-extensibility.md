# ADR 0003：分层插槽注册表

- 状态：Accepted
- 日期：2026-08-19

## 决策

插件在 `apply(ctx)` 中按点分路径注册贡献，例如 `import.source.tab` 和 `shell.bottom-bar.tab`。宿主按贡献契约处理功能，不根据插件 ID 分派业务。

注册表会记录每项贡献的所有者。插件释放时，注册表撤销该插件的贡献。同一槽位可以接收多个贡献。同 ID 的新贡献会覆盖旧贡献；清理旧注册时不能删除新贡献。消费规则见 [ADR 0021](0021-slot-consumption-seam.md)。

简单配置由 `SchemaForm` 渲染，复杂交互使用 `ChronosMountable`。标准槽位与字段以 `packages/core/src/types/slots.ts` 为准。

## 取舍

新插件可以复用现有宿主出口。增加扩展能力时，仍需定义贡献契约、冲突规则和消费位置。
