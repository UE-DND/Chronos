# ADR 0021: 插槽消费机制收敛 — 统一排序契约、文本解析与组件挂载规范

- 状态：Accepted
- 日期：2026-08-23

## 决策

注册表统一按 `order` 升序返回贡献，缺省为 `50`。消费点直接使用结果；主操作通过 `pickPrimary` 选择显式 `isPrimary` 项，否则取首项。

文案由 `resolveLocalizedText` 解析字符串、语言映射或回调，避免各视图自行实现回退。富 UI 统一通过 `MountableSlotOutlet` 管理挂载、props 更新和卸载，具体句柄见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。

## 取舍

排序、文本和生命周期规则集中后，各插槽消费点只需决定自身布局与空状态。
