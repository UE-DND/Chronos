# ADR 0042: 统一插件市场与 Profile 预安装

- 状态：Accepted（主题与服务端声明见 ADR 0043 / 0044）
- 日期：2026-09-20

## 决策与原因

全部业务插件通过市场资源安装。Profile 的 `preinstall` 声明必需插件和首次配置，拒绝 `enabled: false`；预安装与手动安装共用 Manifest、校验、记录和激活路径。`core-shell` 是宿主导航注册函数，不进入市场。静态 `ProfileManager` 装配已移除。

## 安装不变量

- 状态包含安装 `records`、主动卸载集合 `removed`、初始偏好标记 `seeded`。当前预安装项启动时补装并启用，清除对应卸载标记，保留用户配置；Profile 移除某项只解除保护，不删除现有安装。身份由当前 Profile 决定，不由历史 origin 决定。
- 当前全部预安装项均不可被用户禁用或卸载，UI 与服务层共用判断。手动安装清除卸载标记；恢复初始状态清除安装状态后重新装配。
- 首屏先从缓存或目录激活默认主题，并验证 ID、可选状态和所有者；其余插件后台恢复。缺少可用默认主题显式失败，临时缺席不覆盖可恢复的选择。
- 更新先下载校验候选资源，再替换运行时，验证默认主题后提交记录；失败恢复旧运行时和记录，成功才删旧图片。`withPluginReplacement` 临时开放默认提供者的运行时卸载，结束后恢复保护。销毁和重置取消下载。

## 部署与离线

`CHRONOS_PROFILE` 选择客户端预安装，`CHRONOS_DEPLOYMENT` 独立选择服务端插件。客户端安装不会部署服务端；插件用 `supportsPluginServer(pluginId, action)` 探测能力。声明归属见 [ADR 0044](0044-server-plugin-definition-and-deployment-assembly.md)。

PWA 预缓存当前 Profile 全部预安装资源，修订来自最终产物摘要；URL 使用与下载器一致的完整性参数及部署 base。追加清单保留 SvelteKit 默认路径转换。后生成的 `_app/env.js` 与导航文档共用 `pages-cache`，随宿主更新失效。其他市场插件按需下载。

## 取舍

发行必需插件也走安装链路，需处理离线首次补装与失败重试；换来单一记录和生命周期。市场按统一记录显示安装状态。默认主题分发和首屏资源见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。
