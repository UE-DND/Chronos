# ADR 0042：插件市场与 Profile 预安装

- 日期：2026-09-20

## 决策与原因

所有业务插件都通过 Manifest 和市场资源安装。Profile 必需资源随宿主提供，可选官方资源由 Pages 提供，两者共用安装流程。Profile 的 `preinstall` 声明必需插件和初始配置，并拒绝 `enabled: false`。预安装和手动安装共用 Manifest、校验、记录和激活流程。`core-shell` 是宿主导航注册函数，不进入市场。静态 `ProfileManager` 装配已移除。

## 安装不变量

- 状态包含安装记录 `records`、主动卸载集合 `removed` 和初始偏好标记 `seeded`。ADR 0047 增加了集合修订号、宿主代次和更新准备快照。写操作在事务中读取最新记录。启动时会补装并启用当前 Profile 的全部预安装项，清除对应的卸载标记，并保留用户配置。Profile 移除某项时，只会解除保护，不会删除现有安装。插件身份由当前 Profile 决定，不由历史 origin 决定。
- 用户不能禁用或卸载当前 Profile 的预安装项。界面和服务层使用同一判断规则。手动安装会清除卸载标记。恢复初始状态会清除安装状态，再重新装配。
- 首屏先从缓存或市场目录激活默认主题，并验证主题 ID、插件是否可选和注册归属。其余插件在后台恢复。没有可用默认主题时，启动会明确失败。主题暂时缺席时，不覆盖可恢复的用户选择。
- 更新时，系统先下载并校验候选资源，再替换运行时。验证默认主题后才提交安装记录。同宿主内替换失败时，恢复兼容的旧运行时和记录。宿主版本变化后，不恢复不兼容的插件代码。成功后才删除旧图片。`withPluginReplacement` 会临时允许卸载默认主题所属插件，结束后恢复保护。销毁和重置时会取消下载。

## 部署与离线

`CHRONOS_PROFILE` 选择客户端预安装项。`CHRONOS_DEPLOYMENT` 单独选择服务端插件。客户端安装不会部署服务端代码。插件使用 `supportsPluginServer(pluginId, action)` 检查服务端能力。声明归属见 [ADR 0044](0044-server-plugin-definition-and-deployment-assembly.md)。

PWA 会预缓存当前 Profile 的全部预安装资源，修订值来自最终产物摘要。URL 使用与下载器相同的完整性参数和部署 base。追加清单会保留 SvelteKit 默认的路径转换。页面壳和 `_app/env.js` 按构建身份独立保存，由 Worker 校验并缓存。导航始终使用控制该页面的 Worker 所属资源。当前缓存和更新事务见 [ADR 0047](0047-host-update-transactions.md)。其他市场插件从固定宿主版本的 Pages 目录按需下载，不进入宿主产物或预缓存。已安装插件从数据库恢复，远程目录失败不会影响内置插件补装。分发和发布约束见 [ADR 0045](0045-versioned-online-plugin-distribution.md)。

## 取舍

发行必需插件也要经过安装流程，因此必须处理离线首次补装和失败重试。这样所有插件共用一套安装记录和生命周期。市场根据统一记录显示安装状态。默认主题分发和首屏资源见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。
