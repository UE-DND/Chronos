# ADR 0033: 外壳常驻保活与二级页面视图过渡隔离

- 状态：Accepted（冻结范围已合并 ADR 0039 修订）
- 日期：2026-09-03

## 决策

根 Layout 中 `ShellRouteHost` 与二级路由出口互为兄弟。进入二级页时保留一级外壳 DOM，只冻结 `.shell-content` 的布局和绘制，并对外壳设置 `inert` 阻止交互。

`view-transition-name: page-root` 只属于二级页面；退后动画作用于 `.shell-root`。壁纸保持在冻结范围外，见 [ADR 0039](0039-shell-wallpaper-compositor.md)。设置预览延迟到过渡完成再绘制，避免同时渲染两棵课表。

## 取舍

返回时保留周次与滚动状态，减少网格重建；保活仍占内存，隐藏内容的状态与生命周期必须由控制器管理。
