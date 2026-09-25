# ADR 0024：插件消息目录与多语言

- 状态：Accepted
- 日期：2026-08-23

## 决策

每个插件提供自己的消息目录（Message Catalog），并通过 `defineChronosPlugin` 或 `ctx.i18n.registerMessages` 注册。插槽文案在显示时求值。富 UI 使用 `ui-kit` 的 `pluginText`。插件不需要修改宿主词条。

`ChronosEngine.setLocale` 会广播语言变化，响应式控制器据此更新插槽文案。宿主 UI 使用 `host-ui` 消息目录和 `hostT`。Paraglide 负责 Cookie、文档语言和 URL，不通过重载页面切换文案。

## 取舍

宿主和插件共享语言状态，但各自维护词条，避免插件反向依赖宿主翻译。本记录已合并 [ADR 0027](0027-round6-architecture-subtraction.md) 对宿主桥接的修订。
