# ADR 0028：今日插件与默认启动页

- 状态：Accepted（导航见 ADR 0029，时钟见 ADR 0031）
- 日期：2026-08-28

## 决策

`tool-today` 显示当天课程、当前课或下一节课，以及倒计时。它在生产代码中使用跨课表查询 `queryCourses`，不负责完整课表编辑或跨天日程管理。

底栏贡献可以声明 `defaultLaunch`。这是槽位元数据，不是单独的用户偏好。系统按注册表顺序选择第一个声明该值的项目；没有声明时选择课表面板，再没有时选择第一项。延迟恢复的插件不能覆盖用户已手动选择的 Tab。

Tab 使用[外壳内部状态](0029-shell-internal-tab-navigation.md)。所有组件使用[引擎时钟](0031-round7-clock-profile-codegen-navigation-i18n.md)，避免各自计时后显示不同步。
