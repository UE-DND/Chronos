# ADR 0011: 官方插件在线分发与统一加载机制

- 状态：Accepted（预安装由 ADR 0042 统一）
- 日期：2026-08-21

## 决策

插件使用同一进程内引擎生命周期，不维护 Worker 沙箱和进程内加载两套机制。官方目录及 Manifest URL 是分发入口；资源经 SHA-256 校验后激活，安装记录持久化，卸载按所有者清理贡献。

## 取舍

进程内插件可以提供富 UI，但没有安全沙箱；资源哈希只验证完整性，不能替代对来源和代码的信任。ESM 交付见 [ADR 0012](0012-online-plugin-rich-ui-via-esm-and-controlled-preview.md)。

早期 Profile 静态加载路径已移除。预安装与手动安装现在共用 Manifest、资源与安装记录，见 [ADR 0042](0042-unified-plugin-preinstallation.md)。
