# ADR 0029：底栏 Tab 使用外壳内部状态

- 日期：2026-08-30

## 决策

一级 Tab 在 `/` 页面中通过 `activeTabId` 切换。`ShellTabPanels` 会保留已访问的面板，不为每次切换新增路由历史。宿主面板通过 `hostPanel` 标记识别。插件面板根据所有者和屏幕插槽渲染。

课程编辑、设置和插件独立页面继续使用 SvelteKit 路由。二级页面的保活和过渡见 [ADR 0033](0033-persistent-shell-freeze-and-secondary-view-transition.md)，返回行为见 [ADR 0038](0038-unified-navigation-stack.md)。

## 取舍

这样可以保留各 Tab 的滚动位置和课表周次。访问过的面板会持续占用内存，Tab 选择也不会显示在独立 URL 中。
