# ADR 0007: 基于 Profile 的高校预设包与插件装配体系 (ProfileManager)

- 状态：Superseded（静态装配由 ADR 0042 取代）
- 日期：2026-08-20

## 历史决策

以 Profile 描述高校发行差异，避免为不同高校维护代码分支。早期 `ProfileManager` 将业务插件静态打包进宿主，已由统一市场预安装取代。

当前 Profile 仍负责客户端预安装、默认主题和初始偏好，见 [ADR 0042](0042-unified-plugin-preinstallation.md)；服务端部署独立选择，见 [ADR 0044](0044-server-plugin-definition-and-deployment-assembly.md)。
