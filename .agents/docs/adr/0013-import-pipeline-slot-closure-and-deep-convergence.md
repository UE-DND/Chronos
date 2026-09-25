# ADR 0013：统一导入、徽章和主题更新机制

- 状态：Accepted（动态配色已后续修订）
- 日期：2026-08-22

## 决策

Schema 和富 UI 导入共用宿主的预览、确认和错误处理流程。课程徽章统一通过 `timetable.cell.badge` 汇总。宿主不处理具体徽章的业务逻辑。

核心事件只传递通用状态和生命周期信息。项目曾移除壁纸事件，之后又加入 `dynamicColor:*` 事件；这两种做法都已结束。当前通过主题能力获取配色，见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。
