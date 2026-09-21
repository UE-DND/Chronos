# ADR 0001: 微内核与 Monorepo 模块化分层架构

- 状态：Accepted
- 日期：2026-08-19

## 决策

采用 Vite+ Workspace：`core` 持有领域模型、排课算法、引擎与平台端口；`ui-kit` 提供 Svelte 组件和响应式桥接；业务插件持有高校、编解码和工具能力；`apps/web` 负责平台适配与装配。

依赖方向为宿主 → core / ui-kit / 插件，ui-kit → core，插件 → core / ui-kit / 通用库。插件不引用宿主私有实现或其他业务插件。core 不依赖 DOM、SvelteKit 或特定高校。

## 取舍

分层使领域逻辑能在无浏览器环境测试并复用于其他宿主，代价是平台能力必须经端口传入。共享字节原语归 [codec-kit](0020-codec-kit-shared-codec-primitives.md)，配色算法归[主题插件](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)，不放入 core。
