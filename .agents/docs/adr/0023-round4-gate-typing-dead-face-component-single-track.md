# ADR 0023：组件挂载协议与冻结项（已结案）

- 状态：Accepted（冻结项已结案）
- 日期：2026-08-23

## 决策

动态组件统一使用 `ChronosMountable` 协议。项目尚未发布，直接维护当前接口，并删除没有调用方的过渡层。类型和验证入口见根目录 `AGENTS.md` 与 `CONTRIBUTING.md`。

## 冻结项结案

项目曾暂时保留 `queryCourses` 和串行、瀑布钩子，以观察实际需求。[今日插件](0028-today-plugin-default-launch-and-day-clock.md)已使用 `queryCourses`。串行、瀑布机制和守卫包装已移除，见 [ADR 0005](0005-unified-event-pipeline.md)。原定的两轮发布复查已经结束。
