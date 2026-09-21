# ADR 0023: Round 4 架构深化 — 类型门禁强化、清理无用接口与统一组件挂载协议

- 状态：Accepted（冻结项已结案）
- 日期：2026-08-23

## 决策

动态组件只使用 `ChronosMountable` 协议。未发布阶段直接维护当前接口，删除无消费方的过渡层；类型与验证入口以根目录 `AGENTS.md` 和 `CONTRIBUTING.md` 为准。

## 冻结项结案

曾暂时保留 `queryCourses` 与串行／瀑布钩子以观察实际需求。`queryCourses` 已由[今日插件](0028-today-plugin-default-launch-and-day-clock.md) 使用；串行／瀑布机制与守卫包装已移除，见 [ADR 0005](0005-unified-event-pipeline.md)。原两轮发布复查计划已经结束。
