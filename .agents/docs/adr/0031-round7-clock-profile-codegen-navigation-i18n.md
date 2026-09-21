# ADR 0031: Round 7 架构收敛 — 统一时钟调度、Profile 客户端按需打包与导航解耦

- 状态：Accepted（静态 Profile 打包由 ADR 0042 取代）
- 日期：2026-09-01

## 决策

`ChronosEngine` 独占 `DayClock`：按分钟边界调度，经 `time:tick` 向宿主和插件提供同一时间源。冻结停钟，销毁释放，恢复后立即同步并重新对齐分钟。宿主在页面恢复可见时调用 `refreshSystemTime`；core 不监听 DOM，冻结期间忽略刷新。

预览只高亮调用方显式提供的节次。今日课程查询由相关数据变化触发，分钟变化只重算内存状态；异步课程与配色结果各自防止旧请求覆盖新结果。

插件通过可选 `IHostNavigation` 打开宿主课程编辑，不硬编码 Web 路径。

## 演进

本轮的静态插件导入代码生成已由 [ADR 0042](0042-unified-plugin-preinstallation.md) 的市场预安装取代；客户端 Profile 与服务端部署独立。
