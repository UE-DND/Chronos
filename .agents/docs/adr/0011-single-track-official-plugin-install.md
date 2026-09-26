# ADR 0011：官方插件分发与加载

- 日期：2026-08-21

## 决策

插件在同一进程中使用引擎生命周期。项目不同时维护 Worker 沙箱和进程内加载两套机制。官方目录和 Manifest URL 是分发入口。资源通过 SHA-256 校验后才会激活。安装记录会持久化，卸载时按所有者清理贡献。

## 取舍

进程内插件可以提供富 UI，但没有安全沙箱。资源哈希只能验证完整性，不能证明来源和代码可信。ESM 交付见 [ADR 0012](0012-online-plugin-rich-ui-via-esm-and-controlled-preview.md)。

早期的 Profile 静态加载路径已移除。预安装和手动安装现在共用 Manifest、资源和安装记录，见 [ADR 0042](0042-unified-plugin-preinstallation.md)。
