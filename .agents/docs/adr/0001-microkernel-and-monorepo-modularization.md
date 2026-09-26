# ADR 0001：微内核与模块分层

- 日期：2026-08-19

## 决策

采用 Vite+ Workspace 管理 Monorepo。`core` 定义领域模型、排课算法、引擎和平台端口。`ui-kit` 提供 Svelte 组件和响应式桥接。业务插件实现高校数据源、编解码和工具功能。`apps/web` 负责平台适配和模块装配。

依赖方向是宿主依赖 `core`、`ui-kit` 和插件；`ui-kit` 依赖 `core`；插件依赖 `core`、`ui-kit` 或通用库。插件不能引用宿主私有实现或其他业务插件。`core` 不读取 DOM 全局对象，也不执行 DOM 操作。挂载等公共契约可以声明 DOM 类型。领域实现不依赖 SvelteKit 或特定高校。

## 取舍

分层让领域逻辑可以脱离浏览器测试，也能用于其他宿主。平台能力需要通过端口传入。共享字节原语由 [codec-kit](0020-codec-kit-shared-codec-primitives.md) 提供，配色算法由[主题插件](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)提供，都不放入 `core`。
