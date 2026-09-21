# ADR 0037: 插件产品埋点命名与宿主事件清单分离

- 状态：Accepted
- 日期：2026-09-13

## 决策

宿主事件由 `HostAnalyticsEvent` 封闭清单管理，经 `trackEvent` 上报。插件事件不进入宿主清单，而由插件本地定义 action，经 `trackPluginAnalytics(ctx, pluginId, action)` 上报 `plugin.{pluginId}.{action}`。

辅助函数通过可选 `IAnalyticsService` 工作，注入不可被调用方覆盖的 `source: 'plugin'` 和 `plugin_id`。没有统计端口时忽略上报。插件不引用宿主 `$lib/client/analytics`。

## 取舍

事件归所属模块维护，避免每次新增插件埋点都改宿主 union；插件负责约束自己的 action 命名和属性。
