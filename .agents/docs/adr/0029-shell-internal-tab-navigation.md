# ADR 0029: 壳内 Tab 内部状态导航与底栏路由解耦

- 状态：Accepted
- 日期：2026-08-30

## 决策

一级 Tab 在 `/` 内通过 `activeTabId` 切换，已访问面板由 `ShellTabPanels` 保活，不为每次切换创建路由历史。宿主面板由 `hostPanel` 标记识别；插件面板通过所有者与屏幕插槽渲染。

课程编辑、设置和插件独立页继续使用 SvelteKit 路由。二级页保活与过渡见 [ADR 0033](0033-persistent-shell-freeze-and-secondary-view-transition.md)，返回行为见 [ADR 0038](0038-unified-navigation-stack.md)。

## 取舍

Tab 的滚动和课表周次得以保留，代价是访问过的面板持续占用内存，且 Tab 选择不以独立 URL 表达。
