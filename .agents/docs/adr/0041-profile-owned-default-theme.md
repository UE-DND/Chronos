# ADR 0041：Profile 默认主题与壁纸取色

- 日期：2026-09-20

## 决策与原因

默认主题属于 Profile 配置，不由宿主隐式回退到 M3。Profile 必须填写 `defaultTheme: { pluginId, themeId }`，并在当前预安装项中启用主题所属插件。构建时和运行时都会验证主题 ID、插件是否可选，以及注册归属。没有可用主题时，启动会明确失败。

引擎装配前不会激活主题。用户没有选择时，使用 Profile 默认主题。延迟恢复或临时加载失败时保留用户选择。只有确认主题已移除或禁用后，才保存默认回退值。用户不能通过界面停用默认主题所属插件；系统替换和销毁由生命周期流程处理。

## 取舍与演进

Profile 可以选择非 M3 主题作为默认主题，但必须提供有效资源。统一预安装见 [ADR 0042](0042-unified-plugin-preinstallation.md)。M3 主题现在使用静态颜色和 ESM。算法、取色和图标行为见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)，宿主不再使用 M3 基础颜色回退。
