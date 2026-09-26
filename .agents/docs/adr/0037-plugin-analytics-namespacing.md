# ADR 0037：插件统计事件独立命名

- 日期：2026-09-13

## 决策

宿主事件由 `HostAnalyticsEvent` 的固定清单管理，并通过 `trackEvent` 上报。插件事件不加入宿主清单。插件在本地定义 action，并通过 `trackPluginAnalytics(ctx, pluginId, action)` 按 `plugin.{pluginId}.{action}` 上报。

辅助函数通过可选的 `IAnalyticsService` 工作，并注入调用方不能覆盖的 `source: 'plugin'` 和 `plugin_id`。没有统计端口时，辅助函数会忽略上报。插件不引用宿主的 `$lib/client/analytics`。

## 取舍

各模块自行维护所属事件，新增插件统计时不必修改宿主 union。插件负责约束自己的 action 名称和属性。
