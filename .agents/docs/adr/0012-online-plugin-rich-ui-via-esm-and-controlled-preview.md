# ADR 0012: 在线插件富 UI — ESM 独立编译 Svelte 与受控 Schema 预览

- 状态：Accepted（挂载返回值由 ADR 0043 修订）
- 日期：2026-08-21

## 决策

富 UI 插件在构建期编译为自包含 ESM，内联自己的 Svelte 运行时，CSS 单独分发并校验。浏览器通过 Blob URL 加载，不在运行时编译 Svelte。

组件经 `ChronosMountable` 挂载；`MountableSlotOutlet` 负责更新 props 与释放实例，Schema 作为简单表单回退。挂载句柄以 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 为准。

## 取舍

每个 bundle 携带运行时会增加体积，但可独立分发。独立 Svelte 运行时不能读取宿主 context，数据应通过 props、controller 或端口传递。插件 CSS 需要遵守公共 Token 和样式入口；独立打包本身不提供 CSS 沙箱。

壁纸是早期消费案例，现归宿主，见 [ADR 0040](0040-host-wallpaper-and-theme-assets.md)。
