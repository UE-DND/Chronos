# ADR 0032：Profile、宿主面板与导入错误

- 状态：Accepted（ProfileManager 已由 ADR 0042 取代）
- 日期：2026-09-01

## 决策

Profile 定义只维护在 `profile-definitions.ts` 中。当前装配方式见 [ADR 0042](0042-unified-plugin-preinstallation.md)，不再使用本轮引入的 `ProfileManager`。

底栏用 `hostPanel: 'timetable' | 'mine'` 标记宿主面板，不根据 Tab ID 判断。其他 Tab 使用插件屏幕出口。

导入插件使用 `ImportSlotError` 表示 `no-data`、`invalid-data`、`network`、`unsupported` 或 `unknown` 错误。宿主统一显示通知。富 UI 通过 controller 显示通知，不调用浏览器的 `alert`。

## 取舍

配置、面板识别和导入错误各有明确的负责模块，避免不同入口重复实现规则。
