# ADR 0032: Round 8 架构收敛 — 消除双轨装配、单源 Profile 与统一异常规范

- 状态：Accepted（ProfileManager 已由 ADR 0042 取代）
- 日期：2026-09-01

## 决策

Profile 定义以 `profile-definitions.ts` 为单一来源；当前装配由 [ADR 0042](0042-unified-plugin-preinstallation.md) 规定，不再使用本轮引入的 `ProfileManager`。

底栏通过 `hostPanel: 'timetable' | 'mine'` 标记宿主面板，不按 Tab ID 猜测；其他 Tab 走插件屏幕出口。

导入插件使用 `ImportSlotError` 表达 `no-data`、`invalid-data`、`network`、`unsupported` 或 `unknown`。宿主统一处理通知；富 UI 使用 controller 通知，不调用浏览器 `alert`。

## 取舍

配置、面板识别和导入错误都有明确属主，避免不同入口重复实现相同规则。
