# ADR 0005: 统一事件与拦截管道 (EventPipeline)

- 状态：Accepted（广播；拦截管道已移除）
- 日期：2026-08-20

## 决策

`ChronosEngine.events` 提供唯一的强类型 `EventPipeline` 广播入口，插件和宿主通过 `emit` / `on` 通信。动作执行与数据转换由所属模块直接负责。

## 演进与取舍

最初合并事件总线和数据管道时还提供 `serial` / `waterfall`。这些机制没有生产注册方，已于 2026-09 移除；不再保留 `engine.pipeline` 或动作守卫包装层。保留广播满足状态通知，避免为假定扩展场景维护拦截链。
