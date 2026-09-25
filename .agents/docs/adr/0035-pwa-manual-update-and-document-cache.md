# ADR 0035：PWA 更新与导航文档缓存

- 状态：Accepted
- 日期：2026-09-07

## 决策与原因

宿主 PWA 使用 `prompt` 更新策略。新 Service Worker（SW）会等待用户确认，不能自动调用 `skipWaiting`。导航文档使用 `pages-cache` 的 `CacheFirst`。这样可以避免页面提前获取新 HTML 或 JS，而控制页面的 SW 仍是旧版本。

只有存在等待中的 SW 时，`applyUpdateAndReload` 才会先删除 `pages-cache`，再发送 `SKIP_WAITING` 并重载页面。这样可以避免新 SW 接管后，旧 HTML 引用了已清除的旧 chunk。当前版本号来自已加载的 JS 中的 `APP_VERSION`。远端 `version.json` 使用 `NetworkOnly`。

## 约束与取舍

Vercel SSR 的导航 HTML 不进入 precache，`navigateFallback` 设为 `null`。保留旧导航缓存意味着用户安装更新后，新版本才会生效。缓存失效导致的白屏问题应在缓存处理逻辑中修复，不应通过提前更新导航文档来掩盖。

`_app/env.js` 和导航文档同时失效。插件预缓存见 [ADR 0042](0042-unified-plugin-preinstallation.md)。官方插件同步和宿主更新属于不同生命周期，见 [ADR 0030](0030-official-plugin-version-co-shipping-and-host-sync.md)。
