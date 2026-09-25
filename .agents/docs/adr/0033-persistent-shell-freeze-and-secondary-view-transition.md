# ADR 0033：外壳保活与二级页面过渡

- 状态：Accepted（冻结范围已合并 ADR 0039 修订）
- 日期：2026-09-03

## 决策

根 Layout 中，`ShellRouteHost` 和二级路由出口是同级元素。进入二级页面时，一级外壳 DOM 继续保留。系统只冻结 `.shell-content` 的布局和绘制，并给外壳设置 `inert`，阻止用户交互。

`view-transition-name: page-root` 只用于二级页面。返回动画作用于 `.shell-root`。壁纸不在冻结范围内，见 [ADR 0039](0039-shell-wallpaper-compositor.md)。设置预览会等过渡结束后再绘制，避免同时渲染两份课表。

## 取舍

返回时可以保留周次和滚动状态，并减少网格重建。保活会占用内存，因此控制器必须管理隐藏内容的状态和生命周期。
