# ADR 0028: 今日插件、默认启动页与统一时钟调度

- 状态：Accepted（导航见 ADR 0029，时钟见 ADR 0031）
- 日期：2026-08-28

## 决策

`tool-today` 提供当日课程、当前／下一节课及倒计时，作为跨课表 `queryCourses` 的生产消费者；不承担完整课表编辑或跨天日程管理。

底栏贡献可声明 `defaultLaunch`。它是槽位元数据，不是独立用户偏好：按注册表顺序选择首个声明项，否则回退课表面板，再回退首项。延迟恢复的插件不得覆盖用户已经手动选择的 Tab。

Tab 使用[壳内状态](0029-shell-internal-tab-navigation.md)，时间统一来自[引擎时钟](0031-round7-clock-profile-codegen-navigation-i18n.md)，避免组件各自计时导致显示不同步。
