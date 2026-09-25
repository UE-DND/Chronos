# ADR 0012：ESM 插件的富 UI

- 状态：Accepted（挂载返回值由 ADR 0043 修订）
- 日期：2026-08-21

## 决策

富 UI 插件在构建时编译成自包含 ESM，并包含自己的 Svelte 运行时。CSS 单独分发和校验。浏览器通过 Blob URL 加载插件，不在运行时编译 Svelte。

组件通过 `ChronosMountable` 挂载。`MountableSlotOutlet` 负责更新 props 和释放实例。简单表单可以回退到 Schema。挂载句柄以 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 为准。

## 取舍

每个 bundle 都携带运行时，会增加体积，但插件可以独立分发。独立的 Svelte 运行时不能读取宿主 context。数据应通过 props、controller 或端口传入。插件 CSS 必须使用公共 Token 和样式入口。独立打包不会提供 CSS 沙箱。

壁纸曾是插件消费案例，现在由宿主管理，见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md)。
