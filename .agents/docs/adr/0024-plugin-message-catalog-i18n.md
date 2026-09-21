# ADR 0024: 插件多语言架构与 Message Catalog 机制

- 状态：Accepted
- 日期：2026-08-23

## 决策

插件自己提供 Message Catalog，通过 `defineChronosPlugin` 或 `ctx.i18n.registerMessages` 注册。插槽使用延迟求值文案，富 UI 使用 ui-kit 的 `pluginText`，无需修改宿主字典。

`ChronosEngine.setLocale` 广播语言变化，响应式控制器触发插槽文案更新。宿主 UI 使用 `host-ui` catalog 和 `hostT`；Paraglide 负责 cookie、文档语言和 URL 处理，不以页面重载切换文案。

## 取舍

宿主与插件共享语言状态、各自拥有词条，避免插件反向依赖宿主翻译。本文已合并 [ADR 0027](0027-round6-architecture-subtraction.md) 对宿主桥接的修订。
