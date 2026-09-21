# 参与贡献

这份文档介绍 Chronos 的开发、部署和插件接入方式。你可以按需要阅读[开发工作流](#开发工作流)、[部署指南](#部署指南)、[架构地图](#架构地图)或[插件作者指南](#插件作者指南)。本文档更新可能不及时，具体以源码和架构决策记录为准。

## 工作流

本项目使用 [Vite+](https://viteplus.dev) 统一管理开发工具链，请勿使用其它工具进行管理。

### 常用命令

| 命令                                                                       | 用途                                         |
| -------------------------------------------------------------------------- | -------------------------------------------- |
| `vp run dev`                                                               | 启动 Web 开发服务器，同时提供本地插件市场    |
| `vp run check`                                                             | 检查代码格式、Lint 和类型                    |
| `vp run test`                                                              | 运行全部单元测试                             |
| `vp run build`                                                             | 按当前环境配置构建应用和插件                 |
| `vp run build:cqut` / `vp run build:cqut-offline` / `vp run build:default` | 按预设配置构建，同时选择客户端和服务端的插件 |
| `vp run build:pages`                                                       | 构建用于 GitHub Pages 的静态站点             |
| `vp run build:official-plugins`                                            | 单独构建官方插件                             |
| `vp run verify:official-plugins`                                           | 校验已经生成的插件文件                       |
| `vp run theme:generate`                                                    | 手动更新默认主题的资源快照和首屏颜色         |
| `vp run bundle:analyze`                                                    | 构建应用并分析包体积                         |
| `vp run icons:png`                                                         | 根据 SVG 生成 PWA 图标                       |

开发和构建时，使用 `vp run dev`、`vp run build`。请勿直接运行 `vp dev`、`vp build`。任务定义见 [vite.config.ts](vite.config.ts) 和 [package.json](package.json)。

### 检查与提交

开发过程中先运行与改动相关的测试。完成修改后，运行 `vp run check` 和一次完整的 `vp run test`。如果修改了官方插件，还需要运行插件构建或应用构建。只修改文档时可以跳过测试，并在结果中说明。

遇到环境问题时，先运行 `vp env doctor`。CI 会检查多个发行配置的构建结果，具体任务见 [quality.yml](.github/workflows/quality.yml)。

提交信息使用 `<emoji> <简洁中文>`，例如 `✨ 新增课表导出功能`。未发布阶段的数据版本和兼容规则见 [AGENTS.md](AGENTS.md#未发布阶段的数据契约)。

### 构建问题排查

构建缓存保存在 `dist/plugin-cache`。资源准备、代码编译和市场发布分别使用缓存；日志中的 `resources=hit/built`、`compile=hit/built` 表示该阶段是使用缓存还是重新生成。输入发生变化或缓存损坏时会自动重建。如果需要排查不使用缓存时的构建结果，可以手动删除这个目录。

开发环境的插件市场由中间件提供，资源写入 `dist/dev-plugins`，不依赖生产目录 `static/official-plugins`。热更新（HMR）会跟踪插件源码、共享包、CSS 扫描目录和资源文件。内容没有变化时不会重新激活插件；构建失败时继续使用上一次成功生成的文件。

生产环境为每份资源分配不可变的修订标识（revision）。新资源通过校验并发布后，才替换市场目录文件（catalog）。如果需要清理本地旧产物，请先停止构建、预览和下载，再清理 `apps/web/static/official-plugins` 并重新构建。

生产构建会合并应用实际打包的依赖和所有发行插件的依赖，将许可证清单写入发布目录的 `licenses/third-party.json`。开发环境通过中间件提供同一地址，清单可能包含更多依赖。该文件自动生成，无需手动修改。

## 部署指南

Chronos 分别配置客户端安装哪些插件、服务端启用哪些插件，以及部署到哪个平台：

| 变量                    | 作用                                                   | 默认值                                                          |
| ----------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| `CHRONOS_PROFILE`       | 选择客户端发行配置，包括预安装插件、默认主题和初始偏好 | Pages 使用 `chronos-default`，其他情况使用 `chronos-cqut`       |
| `CHRONOS_DEPLOYMENT`    | 选择服务端启用的插件                                   | Pages 使用不含服务端插件的 `pages`，其他情况使用 `chronos-cqut` |
| `CHRONOS_DEPLOY_TARGET` | 选择部署平台和 SvelteKit 适配器                        | 未设置时使用 Vercel；设为 `pages` 时生成纯静态站点              |

**只修改 `CHRONOS_PROFILE`，不会改变服务端启用的插件。** 常用的 `build:*` 任务已经配好了客户端和服务端配置；自定义组合时，需要分别设置。配置定义见 [profile-definitions.ts](apps/web/src/lib/profile-codegen/profile-definitions.ts) 和 [deployment-definitions.ts](apps/web/src/lib/profile-codegen/deployment-definitions.ts)。

| 构建任务                        | 客户端预安装插件                             | 服务端插件    |
| ------------------------------- | -------------------------------------------- | ------------- |
| `build:default` / `build:pages` | `theme-m3`、`codec-share`                    | 无            |
| `build:cqut-offline`            | 上述插件和 `source-cqut`，默认使用 HTML 导入 | 无            |
| `build:cqut`                    | 上述插件和 `source-cqut`，默认使用在线导入   | `source-cqut` |

Vercel 构建会生成 Serverless 函数和静态资源。Pages 的输出目录是 `apps/web/build`，可以通过推送 `v*` 标签或手动运行工作流来部署，见 [pages.yml](.github/workflows/pages.yml)。

统计服务使用 `PUBLIC_POSTHOG_KEY` 和 `PUBLIC_POSTHOG_HOST`。Key 留空时，生产构建不会包含埋点功能。新增服务端插件的方式见 [ADR 0044](.agents/docs/adr/0044-server-plugin-definition-and-deployment-assembly.md)。

## 架构地图

文档中的“宿主”指运行和管理插件的主应用。当前 Web 宿主位于 `apps/web`，其他模块按下表分工。

| 模块                 | 主要职责                                                 | 依赖规则                                                         |
| -------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| `packages/core`      | 领域模型、排课算法、核心引擎，以及平台接口和插件扩展接口 | 不依赖 DOM、SvelteKit 或特定高校的代码                           |
| `packages/ui-kit`    | Svelte 组件、响应式控制器、表单 Schema 和插件组件容器    | 依赖 core                                                        |
| `packages/plugins/*` | 数据源、编解码、工具和主题                               | 可以依赖 core、ui-kit 和通用库，不引用宿主内部模块或其他业务插件 |
| `packages/codec-kit` | 字节编解码的基础函数                                     | 作为普通共享库使用，不作为插件加载                               |
| `apps/web`           | 页面路由、平台适配、插件安装、课表导入和主题显示         | 负责组合并使用上述模块                                           |
| `scripts`            | 插件构建、资源生成流程和产物校验                         | 具体算法和资源生成逻辑由对应插件实现                             |

引擎管理课表等业务状态，`ReactiveChronosController` 将这些状态提供给界面，并在数据变化时通知界面更新。宿主控制器负责管理页面交互状态。

宿主通过 `ChronosEnv` 向引擎提供存储、网络等平台能力。插件通过 `ScopedContext` 使用这些能力；插件停用或卸载时，上下文会清理它注册的资源。

## 插件作者指南

### 定义与生命周期

使用 [`defineChronosPlugin`](packages/core/src/plugin/define-chronos-plugin.ts) 定义插件信息、翻译词条和 `apply(ctx, t)` 初始化逻辑。可以参考[今日插件](packages/plugins/today/src/index.ts)或[分享插件](packages/plugins/codec-share/src/index.ts)。官方构建会自动填入与宿主一致的版本号。

插件通过 `ctx` 获取服务、读写自己的配置和键值数据（KV）、读取应用状态、调用业务操作，以及注册插槽和事件。具体接口见 [context.ts](packages/core/src/types/context.ts)。通过 `registerSlot`、`on` 注册的内容会随上下文自动清理；其他资源需要用 `addDisposable` 登记，或在 `dispose` 中释放。

这些规则约定了模块之间的访问方式。ESM 插件与宿主运行在同一进程中，没有安全沙箱；哈希校验只能确认资源内容是否完整，仍需确认插件来源可信。

### 文案与自定义界面

插件在自己的消息目录（Message Catalog）中维护翻译词条。插槽文案需要随语言切换时，使用 `() => t(key)`；自定义界面使用 `pluginText`。宿主界面则使用 `hostT`，详见 [ADR 0024](.agents/docs/adr/0024-plugin-message-catalog-i18n.md)。

自定义界面通过 [`ChronosMountable`](packages/core/src/types/mountable.ts) 挂载。`mount` 必须返回一个对象，其中包含 `unmount` 方法，也可以提供 `update` 方法。如果挂载失败，插件需要在抛出错误前清理已经创建的资源；挂载成功后，由宿主组件容器负责卸载。简单的输入表单可以直接使用 SchemaForm。

官方 ESM 插件自带 Svelte 运行时，不能通过 `getContext()` 读取宿主的上下文。需要的数据应通过 props、controller 或平台接口获取。插件可以用 `fromStore(controller.snapshot)` 订阅应用状态。

课程颜色通过 `ICoursePresentationService` 获取。颜色分配以整张课表为依据，不要只对当前可见的课程重新分配，否则同一门课在不同页面可能显示不同颜色。

### 样式与资源

UI 插件在 `bundle/entry.ts` 中引入 `bundle/styles.css`。样式文件需要导入 `@chronos/ui-kit/theme/plugin-tailwind.css`，并用 `@source` 指定插件自己的源码目录。插件只生成 Tailwind 工具类，不包含 Preflight 样式重置；宿主不会扫描业务插件的源码。

`text-*`、`ui-*` 等公共样式由宿主提供。颜色和圆角使用公共设计变量（Token），具体说明见[设计 Token](docs/design-tokens.md)。

需要在构建时生成资源的插件，可以在发行配置中声明 `prepareResources` 模块。该模块导出 `prepareResources(outDir)`，返回 `{ colorsJson?, iconsJson? }`，各字段填写生成文件的相对路径。常规构建将文件写入生成目录，不修改源码。详见 [ADR 0043](.agents/docs/adr/0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。

### 导入与导出

导入插件通过 `import.source.tab` 注册导入入口，`executeImport` 返回 core 定义的 `Timetable`。宿主的 `transfer-state` 负责预览、处理确认页输入、检查覆盖操作，最后调用 `engine.importTimetable` 保存课表。插件可以提供确认页的 Schema 或组件，并通过 `finalizePreview` 将确认结果合并到待导入课表中。

导入失败时，插件抛出 `ImportSlotError`。`importKind` 用于选择导入来源的分组文案，`deepLink.fromLocation` 用于识别链接中的导入参数。分享内容由 `codec-share` 编解码，完整导入链接的入口地址由 `IHostLinks` 提供；没有入口地址时，只导出分享口令。

导出插件通过 `export.action` 返回内容，并用 `disposition` 指定复制、下载等处理方式。宿主负责操作剪贴板或下载文件；编解码插件负责格式限制、长度估算和警告文案。

### 网络与宿主能力

插件通过平台接口访问网络和存储等能力。使用可选能力前，先用 `ctx.tryService` 或相应的检测方法确认是否可用。

`IHttpService.proxy` 通过 `/api/plugins/{pluginId}/{action}` 调用服务端。调用前，使用 `supportsPluginServer` 检查服务端是否支持该操作。`bypassCors` 只在支持此功能的原生宿主中生效。

服务端插件通过 `./server` 导出请求处理函数，通过 `./server/definition` 导出插件 ID、代理操作（action）和域名等定义。导入定义模块时不应执行额外操作。宿主需要将插件包加入构建依赖，并在部署配置中选择要启用的插件 ID。客户端安装插件不会改变服务端部署；域名声明用于校验和审查，本身不会限制服务端向外发送请求。

打开宿主页面时使用 `IHostNavigation`，获取公开链接入口时使用 `IHostLinks`，不要自行拼接宿主内部路径。

## 新增官方插件

1. 在 `packages/plugins/` 下创建插件包。包含业务逻辑或自定义界面的插件使用 ESM；只有静态资源的主题可以只提供 JSON。目录结构可以参考现有同类插件。
2. 在 [official-plugins.config.ts](scripts/official-plugins.config.ts) 中注册构建入口和市场展示信息。市场文案独立于插件内部词条，因此在安装前也能显示。
3. 如果某个发行版本需要预安装该插件，将插件 ID 加入对应 Profile。服务端插件还需要加入部署配置和宿主构建依赖。用户不能禁用或卸载当前 Profile 要求预安装的插件。
4. 运行插件构建或对应的应用构建，检查安装、激活和失败回滚是否正常。可选插件还需检查卸载；有界面的插件需检查语言切换，以及关闭界面后的资源清理。

Bundle、Manifest 和 Catalog 都由构建生成，无需提交到版本库。开发环境通过中间件提供插件市场，生产文件输出到 `apps/web/static/official-plugins/`。

默认主题如何在首屏前加载、缺少的预安装插件如何补装，以及用户配置和离线资源如何处理，见 [ADR 0042](.agents/docs/adr/0042-unified-plugin-preinstallation.md)。

## 新增插槽类型

插槽是插件向宿主提供功能的扩展接口。插件注册到插槽的内容称为“贡献”，例如一个导入入口或一个课程操作按钮。

如果现有插槽无法满足需求，在 [slots.ts](packages/core/src/types/slots.ts) 中定义新的贡献类型，并将键名加入 `StandardSlotMap`；宿主也需要增加对应的处理或渲染逻辑。自定义插槽可以通过 TypeScript 模块扩展（module augmentation）添加到 `CustomSlotMap`。

设计时需要说明：多个插件同时注册内容时如何处理、没有内容时如何显示，以及插件卸载后如何清理。排序使用注册表的结果，文案解析使用 `resolveLocalizedText`，主操作选择使用 `pickPrimary`，组件挂载使用现有的 Mountable 容器。

验证注册、覆盖、撤销和界面处理是否符合预期。只有涉及新的架构选择时，才需要增加 ADR。

## 参考：端口契约

端口是宿主提供给引擎和插件的平台接口。完整的方法定义见 [services.ts](packages/core/src/types/services.ts)，宿主如何传入这些能力见 [env.ts](packages/core/src/types/env.ts)。

| 端口                                         | 职责                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `IStorageService`                            | 读写课表、偏好和插件 KV，查询多个课表中的课程；今日插件已使用 `queryCourses` |
| `IHttpService`                               | 发起请求、调用服务端代理、检查服务端能力                                     |
| `IRuntimeService`                            | 提供平台标识和 SHA-256 计算                                                  |
| `IVaultService`                              | 可选的凭据加密存储，Web 端未实现                                             |
| `IAnalyticsService` / `IErrorCaptureService` | 可选的产品统计和错误捕获                                                     |
| `IHostNavigation` / `IHostLinks`             | 可选的宿主页面导航和公开链接查询                                             |
| `ICoursePresentationService`                 | 可选的课程调色板查询，以及按课表获取课程颜色                                 |

插件 KV 支持 JSON 和二进制数据。二进制可以写入 `Blob` 或 `Uint8Array`，读取时统一返回 `Blob`。同一个键只能保存一种数据：写入 JSON 会替换原有二进制数据，反之亦然。详见 [ADR 0036](.agents/docs/adr/0036-plugin-kv-binary-storage.md)。

用户自定义图片和主题图片由宿主单独保存在 `images` 中。

## 参考：槽位目录

完整定义见 [slots.ts](packages/core/src/types/slots.ts)。注册的内容按 `order` 从小到大排序，未设置时按 `50` 处理。同一插槽内，如果 ID 相同，后注册的内容会覆盖先注册的内容。`LocalizedText` 支持字符串、按语言组织的文本对象，以及返回文本的回调函数。

| 槽位                         | 用途与处理规则                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `import.source.tab`          | 注册多个导入来源，使用 Schema 或自定义界面，共用宿主导入流程                        |
| `export.action`              | 注册多个导出操作，由 `pickPrimary` 选择主操作                                       |
| `mine.section` / `mine.item` | 注册“我的”页面中的分组和条目；未指定分组时，宿主使用 `app-support`                  |
| `shell.route.screen`         | 注册 `/plugins/[pluginId]/[id]` 独立页面，也可通过 `landscapeRail` 提供横屏侧栏内容 |
| `shell.bottom-bar.tab`       | 注册应用底部标签页；`hostPanel` 标记宿主页面，`defaultLaunch` 声明默认启动页候选    |
| `timetable.cell.badge`       | 汇总各插件提供的课程徽章，没有贡献时直接返回                                        |
| `course.detail.action`       | 注册课程详情页的操作                                                                |
| `theme.definition`           | 注册配色主题，供用户选择                                                            |
| `theme.icon.definition`      | 注册图标主题，由当前配色主题决定使用哪一套                                          |

应用启动时，优先选择排序后第一个声明了 `defaultLaunch` 的标签页。如果没有，则选择课表页；仍未找到时，选择第一项。标签页切换只改变应用内部状态，不增加路由历史记录。

## 参考：主题契约

[`ThemeContribution`](packages/core/src/types/contributions.ts) 需要提供完整的浅色和深色 Workbench 界面颜色，也可以提供课程调色板、推荐图标主题、壁纸 Blob 和取色函数。允许使用的颜色键见 [workbench-colors.ts](packages/core/src/theme/workbench-colors.ts)，样式用法见[设计 Token](docs/design-tokens.md)。

纯 JSON 主题由宿主读取并注册资源。需要配色算法的主题可以使用 ESM。如果同时提供 ESM 和颜色 JSON，只由 ESM 注册配色主题，宿主会检查它是否属于正确的插件、主题 ID 是否正确，以及运行时颜色是否与静态颜色一致。

Profile 指定默认主题，构建时根据该主题的静态资源生成首屏颜色。M3 算法由 `theme-m3` 实现。

### 壁纸与取色

壁纸来源和配色方案可以分别选择。`wallpaperSource` 支持 `custom`（自定义图片）、`theme`（主题图片）和 `none`（无壁纸）；切换来源不会删除用户图片。

JSON 主题中的壁纸 URL 以颜色 JSON 的地址为基准解析。图片下载并通过校验后，保存到宿主图片库。

只有当前使用 Profile 默认主题、该主题支持取色，并且壁纸来源为 `custom` 时，才能启用壁纸取色。没有图片或取色失败时，保留用户的取色选项，并使用主题的基础外观；条件不再满足时才关闭取色。主题暂时未加载时，不清除用户选择。详见 [ADR 0040](.agents/docs/adr/0040-host-wallpaper-and-theme-assets.md) 和 [ADR 0043](.agents/docs/adr/0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。

### 下载大小

Manifest 中的 `downloadSizeBytes` 只用于显示下载大小，取值为安装所需资源的原始字节数之和。文本按 UTF-8 计算，不包含 Manifest 本身、HTTP 传输压缩的影响或运行时额外请求。未声明这个字段时，不显示大小；资源完整性仍通过 SHA-256 校验。
