# 架构决策记录

架构决策记录按编号保留演进顺序。早期记录说明当时的背景和选择，后续记录说明调整范围。阅读当前实现时，先按主题定位，再沿修订链接查看演进。

记录不使用状态字段。新增决策沿用下一编号，写清修改了哪些边界。修订旧记录时，保留必要背景，注明后续决策，避免将旧方案写成当前行为。

## 按主题查找

| 主题                  | 优先阅读                                                                                                                                                                                                                     | 实现入口                                                                                                             |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 模块分层与平台端口    | [0001](0001-microkernel-and-monorepo-modularization.md)、[0002](0002-service-container-and-ports-adapters.md)、[0027](0027-round6-architecture-subtraction.md)                                                               | `packages/core/src/types/`、`scripts/architecture/`                                                                  |
| 插槽与组件挂载        | [0003](0003-hierarchical-slot-registry-and-extensibility.md)、[0021](0021-slot-consumption-seam.md)、[0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)                                                     | `packages/core/src/types/slots.ts`、`packages/ui-kit/src/`                                                           |
| 导入、分享与编解码    | [0008](0008-host-decoupling-and-deep-ingest-seam.md)、[0020](0020-codec-kit-shared-codec-primitives.md)、[0022](0022-deep-link-handshake.md)                                                                                 | `apps/web/src/lib/transfer/`、`packages/codec-kit/`、`packages/plugins/codec-share/`                                 |
| Profile、部署和移动端 | [0042](0042-unified-plugin-preinstallation.md)、[0044](0044-server-plugin-definition-and-deployment-assembly.md)、[0046](0046-mobile-plugin-server-execution.md)、[0047](0047-host-update-transactions.md)                   | `apps/web/src/lib/profile-codegen/`、`apps/web/scripts/build-config/`、`apps/mobile/src/`                            |
| 插件分发与应用更新    | [0045](0045-versioned-online-plugin-distribution.md)、[0047](0047-host-update-transactions.md)                                                                                                                               | `scripts/official-plugin-build/`、`apps/web/src/lib/services/official-plugins/`、`apps/web/src/lib/client/pwa-sw.ts` |
| 主题、壁纸与样式      | [0034](0034-design-token-layering.md)、[0039](0039-shell-wallpaper-compositor.md)、[0040](0040-host-wallpaper-and-theme-assets.md)、[0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)                      | `packages/core/src/theme/`、`apps/web/src/lib/appearance/`、`packages/plugins/theme-m3/`                             |
| 导航、外壳与时钟      | [0029](0029-shell-internal-tab-navigation.md)、[0031](0031-round7-clock-profile-codegen-navigation-i18n.md)、[0033](0033-persistent-shell-freeze-and-secondary-view-transition.md)、[0038](0038-unified-navigation-stack.md) | `apps/web/src/lib/navigation/`、`packages/core/src/runtime/`                                                         |
| 多语言、存储与统计    | [0024](0024-plugin-message-catalog-i18n.md)、[0036](0036-plugin-kv-binary-storage.md)、[0037](0037-plugin-analytics-namespacing.md)                                                                                          | `packages/core/src/i18n/`、`apps/web/src/lib/storage/`、`packages/core/src/analytics/`                               |

## 主要演进关系

- 0006 的 WebAuthn 保险箱由 0017 移除。可选的凭据端口继续保留。
- 0007 的静态插件装配由 0042 的市场预安装替代。Profile 的发行配置职责继续保留。
- 0014 的壁纸插件由 0040 的宿主图片能力替代。0016 的动态配色广播由 0043 的主题计算能力替代。
- 0026 的图标跟随主题原则继续保留。0043 撤销了 0041 中壁纸取色时固定使用宿主图标的例外。
- 0044 声明 Web 服务端插件。0046 补充移动端 handler 装配，0047 补充 Profile 策略和宿主版本校验。
- 0045 修订 0030、0042 的在线分发位置。0047 再修订 0030、0035、0042、0045 的更新事务和缓存行为。统一版本、市场预安装和历史目录保留原则继续保留。

## 演进顺序

- [0001：微内核与模块分层](0001-microkernel-and-monorepo-modularization.md)
- [0002：服务容器与端口适配器](0002-service-container-and-ports-adapters.md)
- [0003：分层插槽注册表](0003-hierarchical-slot-registry-and-extensibility.md)
- [0005：统一事件广播](0005-unified-event-pipeline.md)
- [0006：WebAuthn 凭据保险箱](0006-hardware-credential-vault-via-webauthn-prf.md)
- [0007：Profile 与插件装配](0007-plugin-profile-and-preset-assembly.md)
- [0008：宿主与插件解耦及统一导入](0008-host-decoupling-and-deep-ingest-seam.md)
- [0009：导入和课表排版的模块边界](0009-deep-architecture-convergence-and-dead-code-purge.md)
- [0010：宿主状态与主题职责](0010-host-state-collapse-and-architecture-deepening.md)
- [0011：官方插件分发与加载](0011-single-track-official-plugin-install.md)
- [0012：ESM 插件的富 UI](0012-online-plugin-rich-ui-via-esm-and-controlled-preview.md)
- [0013：统一导入、徽章和主题更新机制](0013-import-pipeline-slot-closure-and-deep-convergence.md)
- [0014：壁纸插件分发](0014-wallpaper-official-marketplace-only.md)
- [0015：插件构建与实例状态](0015-deepening-round2-build-credential-glue-convergence.md)
- [0016：旧接口清理与动态配色尝试](0016-round3-convergence-and-deprecated-removal.md)
- [0017：Web 不持久化教务凭据](0017-webauthn-credential-retirement.md)
- [0019：Workbench 颜色与图标主题](0019-workbench-color-and-icon-theme-platform.md)
- [0020：共享编解码基础库](0020-codec-kit-shared-codec-primitives.md)
- [0021：插槽的排序、文案和挂载规则](0021-slot-consumption-seam.md)
- [0022：由插件处理深链格式](0022-deep-link-handshake.md)
- [0023：组件挂载协议与冻结项](0023-round4-gate-typing-dead-face-component-single-track.md)
- [0024：插件消息目录与多语言](0024-plugin-message-catalog-i18n.md)
- [0025：插件安装模块与服务端代理契约](0025-official-plugin-modules-and-proxy-contract.md)
- [0026：图标主题跟随配色主题](0026-icon-theme-follows-color-scheme.md)
- [0027：引擎接口与插件定义](0027-round6-architecture-subtraction.md)
- [0028：今日插件与默认启动页](0028-today-plugin-default-launch-and-day-clock.md)
- [0029：底栏 Tab 使用外壳内部状态](0029-shell-internal-tab-navigation.md)
- [0030：官方插件版本与宿主同步](0030-official-plugin-version-co-shipping-and-host-sync.md)
- [0031：引擎时钟与插件导航](0031-round7-clock-profile-codegen-navigation-i18n.md)
- [0032：Profile、宿主面板与导入错误](0032-round8-dual-track-collapse.md)
- [0033：外壳保活与二级页面过渡](0033-persistent-shell-freeze-and-secondary-view-transition.md)
- [0034：设计 Token 分层](0034-design-token-layering.md)
- [0035：PWA 更新与导航文档缓存](0035-pwa-manual-update-and-document-cache.md)
- [0036：插件 KV 支持二进制数据](0036-plugin-kv-binary-storage.md)
- [0037：插件统计事件独立命名](0037-plugin-analytics-namespacing.md)
- [0038：统一导航栈和返回行为](0038-unified-navigation-stack.md)
- [0039：外壳壁纸与内容冻结](0039-shell-wallpaper-compositor.md)
- [0040：宿主壁纸与主题图片](0040-host-wallpaper-and-theme-assets.md)
- [0041：Profile 默认主题与壁纸取色](0041-profile-owned-default-theme.md)
- [0042：插件市场与 Profile 预安装](0042-unified-plugin-preinstallation.md)
- [0043：主题配色与宿主插件契约](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)
- [0044：服务端插件定义与部署配置](0044-server-plugin-definition-and-deployment-assembly.md)
- [0045：按宿主版本在线分发官方插件](0045-versioned-online-plugin-distribution.md)
- [0046：插件声明式移动端代理分发](0046-mobile-plugin-server-execution.md)
- [0047：宿主更新与插件安装事务](0047-host-update-transactions.md)
