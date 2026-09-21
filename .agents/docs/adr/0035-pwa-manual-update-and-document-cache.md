# ADR 0035: PWA 手动更新与导航文档同代

- 状态：Accepted
- 日期：2026-09-07

## 决策与原因

宿主 PWA 使用 `prompt` 更新：新 SW 等待用户确认，不能自动 `skipWaiting`。导航文档使用 `pages-cache` 的 `CacheFirst`，避免提前获取新 HTML/JS，而 controlling SW 仍是旧版本。

`applyUpdateAndReload` 仅在存在 waiting SW 时先删除 `pages-cache`，再 `SKIP_WAITING` 并重载。这样也避免新 SW 接管后旧 HTML 引用已被清除的旧 chunk。当前版本来自已加载 JS 的 `APP_VERSION`，远端 `version.json` 使用 `NetworkOnly`。

## 约束与取舍

Vercel SSR 的导航 HTML 不进 precache，`navigateFallback` 为 `null`。保留旧导航缓存意味着新版本要到用户安装后才生效；白屏问题应在缓存失效路径解决，不能用导航抢先更新掩盖。

`_app/env.js` 随导航文档一起失效，插件预缓存见 [ADR 0042](0042-unified-plugin-preinstallation.md)。官方插件同步与宿主更新是不同生命周期，见 [ADR 0030](0030-official-plugin-version-co-shipping-and-host-sync.md)。
