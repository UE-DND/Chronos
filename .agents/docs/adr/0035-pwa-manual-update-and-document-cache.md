# ADR 0035：PWA 更新与导航文档缓存

- 日期：2026-09-07

## 初始方案

PWA 采用 `prompt` 更新策略，等待用户确认后接管。导航文档曾使用 `pages-cache` 的 `CacheFirst` 策略。用户确认后，宿主删除导航缓存，发送 `SKIP_WAITING`，然后重载页面。

这套方案试图避免新 HTML 与旧 Worker 混用。`_app/env.js` 曾与导航文档同时失效，`version.json` 始终从网络读取。

## 后续演进

[ADR 0047](0047-host-update-transactions.md) 改为按构建身份固定页面壳和环境模块。Worker 导航响应来自自身构建的页面壳。更新先准备插件，再授权目标 Worker 安装。接管后，各窗口核对构建身份并重载。

`pages-cache` 和更新前删除导航缓存已退出当前实现。用户确认更新的原则仍然保留。当前实现见 `apps/web/scripts/build-config/worker-artifacts.ts` 和 `apps/web/src/lib/client/pwa-sw.ts`。
