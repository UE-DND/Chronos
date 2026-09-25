# 参与贡献

这份文档面向 Chronos 的贡献者和插件作者。你可以在这里查找开发、部署和插件开发说明。架构选择见[架构决策记录](.agents/docs/adr/)；具体行为以源码为准。

## 开发工作流

Chronos 使用 [Vite+](https://viteplus.dev) 管理运行时和开发工具。请使用 `vp` 或 `vpx`，不要直接调用其他包管理器或一次性工具运行器。

### 常用命令

| 命令                                                                     | 用途                                 |
| ------------------------------------------------------------------------ | ------------------------------------ |
| `vp run dev`                                                             | 启动 Web 开发服务器和本地插件市场    |
| `vp run check`                                                           | 检查格式、Lint 和类型                |
| `vp run test`                                                            | 运行全部单元测试                     |
| `vp run build`                                                           | 按 target 默认发行配置构建应用和插件 |
| `vp run build:cqut`、`vp run build:cqut-offline`、`vp run build:default` | 构建预设 Web 发行版                  |
| `vp run build:pages`                                                     | 构建 GitHub Pages 静态站点           |
| `vp run mobile:build`、`vp run mobile:sync`                              | 构建移动端资源并同步到原生工程       |
| `vp run mobile:open:android`                                             | 在 Android Studio 中打开工程         |
| `vp run build:official-plugins`                                          | 单独构建官方插件                     |
| `vp run verify:official-plugins`                                         | 校验已生成的插件文件                 |
| `vp run theme:generate`                                                  | 更新默认主题资源快照和首屏颜色       |
| `vp run bundle:analyze`                                                  | 构建应用并分析包体积                 |
| `vp run icons:png`                                                       | 从 SVG 生成 PWA 图标                 |

开发和构建任务应使用 `vp run dev`、`vp run build`。不要使用 `vp dev` 或 `vp build`。任务定义见 [vite.config.ts](vite.config.ts) 和 [package.json](package.json)。

### 检查与提交

开发时先运行与改动相关的检查。完成后运行 `vp run check` 和完整的 `vp run test`。修改官方插件时，还要构建插件或对应应用。只修改文档时可以跳过测试，并在结果中说明。

遇到环境问题时，先运行 `vp env doctor`。CI 会检查多个发行配置的构建结果，任务见 [quality.yml](.github/workflows/quality.yml)。

提交信息使用 `<emoji> <简洁中文>`，例如 `✨ 新增课表导出功能`。未发布阶段的数据版本和兼容规则见 [AGENTS.md](AGENTS.md#未发布阶段的数据契约)。

### 构建问题排查

构建缓存位于 `dist/plugin-cache`。资源准备、代码编译和市场发布分别使用缓存。日志中的 `resources=hit/built` 和 `compile=hit/built` 表示对应阶段命中缓存或重新生成。输入变化或缓存损坏时，构建会自动重建。要检查无缓存的构建结果，可以手动删除该目录。

开发环境的插件市场由中间件提供，资源写入 `dist/dev-plugins`，不使用生产目录 `static/official-plugins`。热更新（HMR）会跟踪插件源码、共享包、CSS 扫描目录和资源文件。内容未变化时不会重新激活插件。构建失败时会继续使用上一次成功生成的文件。

生产环境会为每份资源分配不可变的修订标识（revision）。新资源通过校验并发布后，构建才会替换市场目录文件（catalog）。清理本地产物前，先停止构建、预览和下载。然后清理 `apps/web/static/official-plugins` 并重新构建。

生产构建会合并应用实际打包的依赖和所有发行插件的依赖，并将许可证清单写入发布目录的 `licenses/third-party.json`。开发环境通过中间件提供同一地址，清单可能包含更多依赖。该文件由构建生成，不需要手动修改。

## 部署指南

Chronos 分别配置客户端预安装的插件、服务端启用的插件和部署平台。

| 变量                    | 作用                                                                   | 默认值                                            |
| ----------------------- | ---------------------------------------------------------------------- | ------------------------------------------------- |
| `CHRONOS_DISTRIBUTION`  | 选择 `apps/web/config/distributions.toml` 中的 profile/deployment 组合 | 未指定时按 target 选择默认发行项                  |
| `CHRONOS_PROFILE`       | 覆盖发行项的客户端 profile                                             | 发行项 profile                                    |
| `CHRONOS_DEPLOYMENT`    | 覆盖发行项的服务端 deployment                                          | 发行项 deployment                                 |
| `CHRONOS_DEPLOY_TARGET` | 选择部署平台、适配器和 PWA 构建行为                                    | 未设置时使用 Vercel；也可设为 `pages` 或 `mobile` |

发行项把 profile 与 deployment 配成一组；deploy target 仍独立选择。Profile 选择客户端预装内容，deployment 选择服务端插件，target 选择平台适配器、SvelteKit 适配器和 PWA 行为。解析优先级为：target 决定默认发行项；`CHRONOS_DISTRIBUTION` / `--distribution` 选择发行项；profile/deployment 环境变量覆盖发行项；对应 CLI 参数优先级最高。常用 `build:*` 任务会显式选择发行项。

需要可复用的自定义组合时，在 `apps/web/config/distributions.toml` 添加发行项：

```toml
[distributions.my-offline]
profile = "chronos-cqut-offline"
deployment = "chronos-default"
```

然后使用 `CHRONOS_DISTRIBUTION=my-offline vp run build`。临时组合可直接覆盖字段，例如 `vp run build -- --profile chronos-default --deployment chronos-cqut`；也可以使用对应的 `CHRONOS_PROFILE`、`CHRONOS_DEPLOYMENT` 和 `CHRONOS_DEPLOY_TARGET` 环境变量。构建会检查所选 profile、deployment 和 target 的有效性与兼容性。

| Deploy target | 构建形态                        | PWA  | 默认 deployment        |
| ------------- | ------------------------------- | ---- | ---------------------- |
| `vercel`      | Vercel Serverless 和静态资源    | 启用 | `chronos-default`      |
| `pages`       | 静态站点，路径前缀为 `/Chronos` | 启用 | `pages`，无服务端插件  |
| `mobile`      | Capacitor 使用的静态 SPA        | 禁用 | `mobile`，无服务端插件 |

`vp run mobile:build` 使用 `mobile` target 和 `mobile` 发行项，然后同步 Capacitor 工程。移动端不包含服务端插件，需要服务端代理的插件功能不会注册。target 定义见 [deploy-targets.ts](apps/web/src/lib/config/deploy-targets.ts)，profile 和 deployment 组合见 [distributions.toml](apps/web/config/distributions.toml)。

Web 的软件更新使用 Service Worker；移动端构建关闭 PWA。移动端通过原生平台适配器打开外部应用商店或 GitHub 发布下载链接进行更新。

| 构建任务                       | 客户端预安装插件                             | 服务端插件    |
| ------------------------------ | -------------------------------------------- | ------------- |
| `build:default`、`build:pages` | `theme-m3`、`codec-share`                    | 无            |
| `build:cqut-offline`           | 上述插件和 `source-cqut`，默认使用 HTML 导入 | 无            |
| `build:cqut`                   | 上述插件和 `source-cqut`，默认使用在线导入   | `source-cqut` |

Vercel 构建会生成 Serverless 函数和静态资源。Pages 的输出目录是 `apps/web/build`。你可以推送 `v*` 标签部署，也可以手动运行工作流。具体步骤见 [pages.yml](.github/workflows/pages.yml)。

统计服务使用 `PUBLIC_POSTHOG_KEY` 和 `PUBLIC_POSTHOG_HOST`。Key 留空时，生产构建不会包含统计功能。新增服务端插件见 [ADR 0044](.agents/docs/adr/0044-server-plugin-definition-and-deployment-assembly.md)。

## 架构地图

“宿主”指运行和管理插件的主应用。当前 Web 宿主位于 `apps/web`。其他模块的职责如下。

| 模块                 | 主要职责                                              | 依赖规则                                                               |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `packages/core`      | 领域模型、排课算法、核心引擎、平台接口和插件扩展接口  | 不依赖 DOM、SvelteKit 或特定高校代码                                   |
| `packages/ui-kit`    | Svelte 组件、响应式控制器、表单 Schema 和插件组件容器 | 依赖 `core`                                                            |
| `packages/plugins/*` | 数据源、编解码、工具和主题                            | 可以依赖 `core`、`ui-kit` 和通用库；不能引用宿主内部模块或其他业务插件 |
| `packages/codec-kit` | 字节编解码基础函数                                    | 作为共享库使用，不作为插件加载                                         |
| `apps/web`           | 页面路由、纯 Web 平台适配、插件安装与主题显示         | 纯 Web 宿主；Vercel/Pages 依赖图不包含 `@capacitor/*` 原生依赖         |
| `apps/mobile`        | 原生容器工程、移动平台适配器和原生插件集成            | 依赖 Capacitor 原生库；在移动构建时通过配置提供原生平台适配器实现      |
| `scripts`            | 插件构建、资源生成和产物校验                          | 具体算法和资源生成逻辑由对应插件实现                                   |

宿主与平台适配器边界：`apps/web` 是标准 Web 宿主，在任何构建目标下均不直接依赖 `@capacitor/*`。原生移动能力由独立移动宿主 `apps/mobile` 维护，仅在 Mobile 静态 SPA 构建时通过配置与别名注入平台适配器。插件与业务代码面向 `HostPlatformAdapter` 或 `ChronosEnv` 编程，插件不得直接导入 `@capacitor/*`。

引擎管理课表等业务状态。`ReactiveChronosController` 将状态提供给界面，并在状态变化时通知界面。宿主控制器管理页面交互状态。

宿主通过 `ChronosEnv` 向引擎提供存储、网络等平台能力。插件通过 `ScopedContext` 使用这些能力。插件停用或卸载时，上下文会清理插件注册的资源。

## 插件作者指南

### 定义与生命周期

使用 [`defineChronosPlugin`](packages/core/src/plugin/define-chronos-plugin.ts) 定义插件信息、翻译词条和 `apply(ctx, t)` 初始化逻辑。可以参考[今日插件](packages/plugins/today/src/index.ts)或[分享插件](packages/plugins/codec-share/src/index.ts)。官方构建会填入与宿主相同的版本号。

插件通过 `ctx` 获取服务、读写自己的配置和键值数据（KV）、读取应用状态、调用业务操作，并注册插槽和事件。接口见 [context.ts](packages/core/src/types/context.ts)。`registerSlot` 和 `on` 注册的内容会随上下文自动清理。其他资源需要用 `addDisposable` 登记，或在 `dispose` 中释放。

ESM 插件和宿主运行在同一进程，没有安全沙箱。哈希校验只能确认资源完整，不能证明插件来源可信。安装前仍要确认插件来源。

### 文案与自定义界面

插件在自己的消息目录（Message Catalog）中维护翻译词条。插槽文案要随语言切换时，使用 `() => t(key)`；自定义界面使用 `pluginText`。宿主界面使用 `hostT`。详情见 [ADR 0024](.agents/docs/adr/0024-plugin-message-catalog-i18n.md)。

自定义界面通过 [`ChronosMountable`](packages/core/src/types/mountable.ts) 挂载。`mount` 必须返回包含 `unmount` 方法的对象，也可以提供 `update` 方法。挂载失败时，插件应在抛出错误前清理已创建的资源。挂载成功后，宿主组件容器负责卸载。简单输入表单可以使用 `SchemaForm`。

官方 ESM 插件包含自己的 Svelte 运行时，因此不能用 `getContext()` 读取宿主上下文。需要的数据应通过 props、controller 或平台接口传入。插件可以用 `fromStore(controller.snapshot)` 订阅应用状态。

课程颜色通过 `ICoursePresentationService` 获取。颜色分配以整张课表为准。不要只给当前可见的课程重新分配颜色，否则同一门课可能在不同页面显示不同颜色。

### 样式与资源

UI 插件在 `bundle/entry.ts` 中导入 `bundle/styles.css`。样式文件需要导入 `@chronos/ui-kit/theme/plugin-tailwind.css`，并用 `@source` 指定插件自己的源码目录。插件只生成 Tailwind 工具类，不包含 Preflight 样式重置。宿主不会扫描业务插件的源码。

`text-*`、`ui-*` 等公共样式由宿主提供。颜色和圆角使用公共设计变量（Token），详情见[设计 Token](docs/design-tokens.md)。

需要在构建时生成资源的插件，可以在发行配置中声明 `prepareResources` 模块。模块导出 `prepareResources(outDir)`，并返回 `{ colorsJson?, iconsJson? }`。各字段填写生成文件的相对路径。常规构建会将文件写入生成目录，不会修改源码。详情见 [ADR 0043](.agents/docs/adr/0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。

### 导入与导出

导入插件通过 `import.source.tab` 注册入口。`executeImport` 返回 core 定义的 `Timetable`。宿主的 `transfer-state` 负责预览、处理确认页输入、检查覆盖操作，最后调用 `engine.importTimetable` 保存课表。插件可以提供确认页 Schema 或组件，再用 `finalizePreview` 将确认结果合并到待导入课表。

导入失败时，插件抛出 `ImportSlotError`。`importKind` 用于选择导入来源的分组文案。`deepLink.fromLocation` 用于识别链接中的导入参数。分享内容由 `codec-share` 编解码。完整导入链接由 `IHostLinks` 提供；没有入口地址时，只导出分享口令。

导出插件通过 `export.action` 返回内容，并用 `disposition` 指定复制或下载等处理方式。宿主负责操作剪贴板或下载文件。编解码插件负责格式限制、长度估算和警告文案。

### 网络与宿主能力

插件通过平台接口访问网络、存储等能力。使用可选能力前，先用 `ctx.tryService` 或相应检测方法确认能力可用。

`IHttpService.proxy` 通过 `/api/plugins/{pluginId}/{action}` 调用服务端。调用前，使用 `supportsPluginServer` 检查服务端是否支持对应操作。`bypassCors` 只在支持该功能的原生宿主中生效。

官方插件 Manifest 的 `optionalServerCapabilities` 表示插件可使用的服务端能力。已声明的能力若在当前部署不可用，插件列表会显示提示，但仍允许安装。当前构建只会把已启用的服务端插件写入该字段，因此未启用的可选能力可能没有提示；插件仍须用 `supportsPluginServer` 检查后再注册相关入口。项目尚无通用的网络依赖声明。联网导入可用 `importKind: 'online'` 标记；其他联网功能应检查请求失败后的行为，并在界面说明限制或降级结果。

服务端插件通过 `./server` 导出请求处理函数，通过 `./server/definition` 导出插件 ID、代理操作（action）和域名等定义。导入定义模块时不要执行其他操作。宿主需要将插件包加入构建依赖，并在部署配置中选择启用的插件 ID。域名声明用于校验和审查，不会限制服务端出站请求。

打开宿主页面时使用 `IHostNavigation`。获取公开链接入口时使用 `IHostLinks`。不要自行拼接宿主内部路径。

## 新增官方插件

1. 在 `packages/plugins/` 下创建插件包。有业务逻辑或自定义界面的插件使用 ESM。只有静态资源的主题可以只提供 JSON。目录结构可以参考现有同类插件。
2. 在 [official-plugins.config.ts](scripts/official-plugins.config.ts) 中注册构建入口和市场展示信息。市场文案独立于插件内部词条，因此插件安装前也能显示。
3. 如果某个发行版本需要预安装该插件，将插件 ID 加入对应 Profile。服务端插件还需要加入部署配置和宿主构建依赖。当前 Profile 要求预安装的插件不能禁用或卸载。
4. 运行插件构建或对应的应用构建，检查安装、激活和失败回滚。可选插件还要检查卸载。有界面的插件还要检查语言切换和关闭界面后的资源清理。

Bundle、Manifest 和 Catalog 都由构建生成，不需要提交到版本库。开发环境通过中间件提供插件市场。生产文件输出到 `apps/web/static/official-plugins/`。

默认主题如何在首屏前加载、如何补装缺少的预安装插件，以及用户配置和离线资源的处理方式，见 [ADR 0042](.agents/docs/adr/0042-unified-plugin-preinstallation.md)。

## 新增插槽类型

插槽是插件向宿主提供功能的扩展接口。插件注册到插槽的内容称为“贡献”，例如导入入口或课程操作按钮。

现有插槽无法满足需求时，在 [slots.ts](packages/core/src/types/slots.ts) 中定义贡献类型，并将键名加入 `StandardSlotMap`。宿主也要增加相应的处理或渲染逻辑。自定义插槽可以通过 TypeScript 模块扩展（module augmentation）加入 `CustomSlotMap`。

设计时要说明多个插件同时注册时如何处理、没有内容时如何显示，以及插件卸载后如何清理。排序使用注册表结果。文案使用 `resolveLocalizedText` 解析。主操作使用 `pickPrimary` 选择。组件挂载使用现有的 Mountable 容器。

验证注册、覆盖、撤销和界面处理是否符合预期。只有新增架构选择时，才需要增加 ADR。

## 参考：端口契约

端口是宿主提供给引擎和插件的平台接口。方法定义见 [services.ts](packages/core/src/types/services.ts)。宿主传入这些能力的方式见 [env.ts](packages/core/src/types/env.ts)。

| 端口                                        | 职责                                                                             |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| `IStorageService`                           | 读写课表、偏好和插件 KV，并查询多个课表中的课程。今日插件已使用 `queryCourses`。 |
| `IHttpService`                              | 发起请求、调用服务端代理和检查服务端能力。                                       |
| `IRuntimeService`                           | 提供平台标识和 SHA-256 计算。                                                    |
| `IVaultService`                             | 可选的凭据加密存储。Web 端未实现。                                               |
| `IAnalyticsService`、`IErrorCaptureService` | 提供可选的产品统计和错误捕获。                                                   |
| `IHostNavigation`、`IHostLinks`             | 提供可选的宿主页面导航和公开链接查询。                                           |
| `ICoursePresentationService`                | 查询课程调色板，以及按课表获取课程颜色。                                         |

插件 KV 支持 JSON 和二进制数据。二进制数据可以写入 `Blob` 或 `Uint8Array`，读取时统一返回 `Blob`。同一个键只能保存一种数据。写入 JSON 会替换原有二进制数据，反之亦然。详情见 [ADR 0036](.agents/docs/adr/0036-plugin-kv-binary-storage.md)。

用户自定义图片和主题图片由宿主单独保存在 `images` 中。

## 参考：槽位目录

完整定义见 [slots.ts](packages/core/src/types/slots.ts)。贡献按 `order` 从小到大排序，未设置时按 `50` 处理。同一插槽内，ID 相同的贡献由后注册者覆盖。`LocalizedText` 支持字符串、按语言组织的文本对象，以及返回文本的回调函数。

| 槽位                        | 用途与处理规则                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `import.source.tab`         | 注册多个导入来源。可以使用 Schema 或自定义界面，并共用宿主导入流程。                  |
| `export.action`             | 注册多个导出操作，由 `pickPrimary` 选择主操作。                                       |
| `mine.section`、`mine.item` | 注册“我的”页面中的分组和条目。未指定分组时，宿主使用 `app-support`。                  |
| `shell.route.screen`        | 注册 `/plugins/[pluginId]/[id]` 独立页面，也可以用 `landscapeRail` 提供横屏侧栏内容。 |
| `shell.bottom-bar.tab`      | 注册应用底部标签页。`hostPanel` 标记宿主页面，`defaultLaunch` 声明默认启动页候选。    |
| `timetable.cell.badge`      | 汇总插件提供的课程徽章。没有贡献时直接返回。                                          |
| `course.detail.action`      | 注册课程详情页操作。                                                                  |
| `theme.definition`          | 注册供用户选择的配色主题。                                                            |
| `theme.icon.definition`     | 注册图标主题，由当前配色主题决定使用哪套图标。                                        |

应用启动时，按排序结果选择第一个声明 `defaultLaunch` 的标签页。没有声明时选择课表页；仍未找到时选择第一项。切换标签页只改变应用内部状态，不增加路由历史记录。

## 参考：主题契约

[`ThemeContribution`](packages/core/src/types/contributions.ts) 要提供完整的浅色和深色 Workbench 界面颜色。它还可以提供课程调色板、推荐图标主题、壁纸 Blob 和取色函数。允许使用的颜色键见 [workbench-colors.ts](packages/core/src/theme/workbench-colors.ts)，样式用法见[设计 Token](docs/design-tokens.md)。

宿主读取并注册纯 JSON 主题资源。需要配色算法的主题可以使用 ESM。如果主题同时提供 ESM 和颜色 JSON，只有 ESM 会注册配色主题。宿主会检查插件归属、主题 ID，以及运行时颜色是否与静态颜色一致。

Profile 指定默认主题。构建时会根据主题的静态资源生成首屏颜色。M3 算法由 `theme-m3` 实现。

### 壁纸与取色

壁纸来源和配色方案可以分别选择。`wallpaperSource` 支持 `custom`（自定义图片）、`theme`（主题图片）和 `none`（无壁纸）。切换来源不会删除用户图片。

JSON 主题中的壁纸 URL 以颜色 JSON 地址为基准解析。图片下载并通过校验后，会保存到宿主图片库。

只有当前使用 Profile 默认主题、该主题支持取色、壁纸来源为 `custom` 时，才能启用壁纸取色。没有图片或取色失败时，保留用户的取色选项，并使用主题基础外观。只有条件失效时才关闭取色。主题暂时未加载时，不清除用户选择。详情见 [ADR 0040](.agents/docs/adr/0040-host-wallpaper-and-theme-assets.md) 和 [ADR 0043](.agents/docs/adr/0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。

### 下载大小

Manifest 中的 `downloadSizeBytes` 只用于显示下载大小。它的值是安装所需资源的原始字节数之和。文本按 UTF-8 计算，不包括 Manifest、HTTP 传输压缩和运行时额外请求。未声明此字段时，不显示大小。资源完整性仍通过 SHA-256 校验。
