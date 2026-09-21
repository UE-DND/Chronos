# ADR 0013: 导入管道插槽化闭环、内核事件精简与徽章机制统一

- 状态：Accepted（动态配色已后续修订）
- 日期：2026-08-22

## 决策

导入的 Schema 和富 UI 共用宿主预览、确认与错误处理流程。课程徽章统一通过 `timetable.cell.badge` 聚合，宿主不写具体徽章的业务分支。

核心事件只承载通用状态与生命周期。早期移出壁纸事件、随后引入 `dynamicColor:*` 的过程已结束；当前配色采用主题能力调用，见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。
