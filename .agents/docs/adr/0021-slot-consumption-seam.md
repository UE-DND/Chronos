# ADR 0021：插槽的排序、文案和挂载规则

- 日期：2026-08-23

## 决策

注册表按 `order` 升序返回贡献，默认值为 `50`。消费点直接使用排序结果。主操作通过 `pickPrimary` 选择显式设置 `isPrimary` 的项目；没有这类项目时，选择第一项。

`resolveLocalizedText` 负责解析字符串、语言映射和回调。各视图不再自行实现语言回退。富 UI 统一由 `MountableSlotOutlet` 管理挂载、props 更新和卸载。挂载句柄见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。

## 取舍

集中处理排序、文案和生命周期后，各插槽消费点只需决定自己的布局和空状态。
