# ADR 0007：Profile 与插件装配（已废弃）

- 状态：Superseded（静态装配由 ADR 0042 取代）
- 日期：2026-08-20

## 历史决策

Profile 用于描述高校发行差异，避免为不同高校维护代码分支。早期的 `ProfileManager` 会把业务插件静态打包进宿主。现在已改为从统一市场预安装插件。

当前 Profile 仍负责客户端预安装、默认主题和初始偏好，见 [ADR 0042](0042-unified-plugin-preinstallation.md)。服务端部署单独选择，见 [ADR 0044](0044-server-plugin-definition-and-deployment-assembly.md)。
