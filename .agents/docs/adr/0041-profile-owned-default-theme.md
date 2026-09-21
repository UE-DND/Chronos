# ADR 0041: Profile 装配默认主题与独立壁纸取色

- 状态：Accepted（分发和配色由 ADR 0042 / 0043 修订）
- 日期：2026-09-20

## 决策与原因

默认主题属于 Profile 配置，不是宿主隐含的 M3 后备值。`defaultTheme: { pluginId, themeId }` 必填，提供者必须在当前预安装项中启用。构建和运行时均验证主题 ID、可选状态及注册归属；缺少可用主题时显式启动失败。

引擎装配前没有激活主题。没有用户选择时使用 Profile 默认值；延迟恢复或临时加载失败保留用户选择，仅确认移除或禁用后持久化默认回退。默认提供者在用户入口受保护，系统替换和销毁由生命周期流程处理。

## 取舍与演进

Profile 可以使用非 M3 默认主题，但必须承担提供有效资源的责任。统一预安装见 [ADR 0042](0042-unified-plugin-preinstallation.md)；M3 已改为静态颜色 + ESM，算法、取色和图标行为见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)，不再使用宿主 M3 基础色回退。
