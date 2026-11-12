# 参与贡献

这份文档给 Chronos 的贡献者和插件作者查阅开发、部署和插件扩展的做法。架构取舍见[架构决策记录](.agents/docs/adr/README.md)。行为以源码为准。

- [开发工作流](#开发工作流)
- [架构地图](#架构地图)
- [部署指南](#部署指南)
- [插件作者指南](#插件作者指南)
- [新增官方插件与插槽类型](#新增官方插件与插槽类型)
- [参考：端口契约](#参考端口契约)
- [参考：槽位目录](#参考槽位目录)
- [参考：主题契约](#参考主题契约)

## 开发工作流

Chronos 仓库包含 Web 宿主、共享包、插件包和 Capacitor 移动端。依赖和任务都用 [Vite+](https://viteplus.dev) 管理。命令在仓库根目录执行，使用 `vp` 或 `vpx`，不要直接调用 npm、pnpm、yarn 或 npx。还没有 Vite+ 时，按[官方说明](https://viteplus.dev/guide/global-cli)安装全局 `vp`。

### 环境要求

本地开发和 CI 使用 Node.js 26.13.0 LTS，不再支持 Node.js 24。Vercel 函数使用平台提供的 Node.js 26.x，补丁版本由平台更新。

根目录和 Web 包的 `.node-version` 固定为同一版本。CI 读根目录那份；Web 包单独固定，是为了避免它的 `engines.node` 范围盖过 Vite+ 从父目录继承的版本。升级 Node 时，同时改这两个文件、两处 `engines.node` 和 `@types/node`，然后运行 `vp install`、完整检查和发行版构建。Vercel 的预构建跑在已经装好 Vite+ 的 GitHub Actions 里，安装依赖使用 `vp`，不依赖 Node.js 自带的 Corepack。

Web 宿主使用 SvelteKit 3。源码中的 `#lib/*` 导入要写实际文件扩展名。环境变量在 `apps/web/src/env.ts` 里声明，经 `$app/env/public` 读取。PWA 使用官方的 `@vite-pwa/sveltekit` 2，通过 `withPwa` 接入。移动端构建关闭 manifest，并在适配器输出后去掉 PWA 产物。改了 PWA 或离线更新相关实现后，跑浏览器回归里的离线更新用例。

### 初次运行

```sh
vp install
vp run dev
```

第一次克隆、切换分支或拉取了依赖变更之后，先运行 `vp install`。开发服务器启动后会在终端打印本地地址，同时准备本地官方插件市场，并支持插件热更新。默认不需要 API 密钥。

要改环境变量时，把根目录的 [`.env.example`](.env.example) 复制为 `apps/web/.env.local` 再修改。这个本地文件不提交。

运行或安装出问题时，先看 `vp --version`、`vp toolchain` 和 `node --version`，再运行 `vp env doctor`。

### 常用命令

| 命令                                                                     | 用途                                      |
| ------------------------------------------------------------------------ | ----------------------------------------- |
| `vp run dev`                                                             | 启动 Web 开发服务器和本地插件市场         |
| `vp run dev -- --distribution cqut`                                      | 用 CQUT 发行配置启动开发服务器            |
| `vp run check`                                                           | 检查格式、Lint 和类型                     |
| `vp run test`                                                            | 先构建测试依赖的官方插件，再运行测试      |
| `vp run test:browser`                                                    | 构建两份生产版本并运行 Chromium PWA 回归  |
| `vp run check:web`、`vp run test:web`                                    | 只跑 Web 包的检查或测试                   |
| `vp run build`                                                           | 按默认 target 和发行配置构建应用及插件    |
| `vp run build:cqut`、`vp run build:cqut-offline`、`vp run build:default` | 构建预设的 Web 发行版                     |
| `vp run build:pages`                                                     | 构建 GitHub Pages 静态站点                |
| `vp run build:cloudflare`、`preview:cloudflare`、`deploy:cloudflare`     | 构建、本地运行或上传 Cloudflare Pages     |
| `vp run mobile:build`                                                    | 构建移动端资源并同步 Capacitor 工程       |
| `vp run mobile:open:android`                                             | 用 Android Studio 打开 Android 工程       |
| `vp run --filter @chronos/mobile run:android`                            | 在已配置的设备或模拟器上运行 Android 应用 |
| `vp run build:official-plugins`、`vp run verify:official-plugins`        | 单独构建或校验官方插件                    |

开发和构建从仓库根目录用 `vp run` 调用。额外参数放在 `--` 后面，例如 `vp run build -- --profile chronos-default`。不要用 `vp dev` 或 `vp build` 代替这些任务。全部任务见 [vite.config.ts](vite.config.ts) 和各包的 `package.json`。

### 单元测试与组件测试

测试文件放在对应模块旁边，用 `.test.ts` 或 `.spec.ts` 命名。提交前运行 `vp run check` 和 `vp run test`。改动范围清楚时，开发过程中可以先跑相关文件，结束前再跑完整套件。只改文档时可以不跑测试，但至少运行 `vp fmt --check <文件>` 和 `git diff --check`。

`vp run check` 还会检查运行时依赖、源码导入和 Svelte 脚本，并同时解析 Web 与 Mobile 的平台别名。生产 Web 构建会再检查最终模块图，避免把 Capacitor 打进纯 Web 产物。

改了官方插件时，运行 `vp run build:official-plugins` 或相应的应用构建，并核对安装、启用和相关界面。领域、HTML 解析、分享往返和浏览器导入共用同一组[课表场景](packages/core/tests/fixtures/README.md)。新增场景时，输入和预期结果一起维护。

CI 还会构建 CQUT、CQUT 离线、默认、Mobile 和 Pages 发行版，见 [quality.yml](.github/workflows/quality.yml)。

### 浏览器回归

第一次跑浏览器回归时，先安装 Chromium：

```sh
vp exec playwright install chromium
vp run test:browser
```

任务会构建 `old`、`new`，以及部署路径不同的 `isolated` 三份 Pages 产物，再在同一来源上切换部署。`old` 和 `new` 的应用版本相同，公共环境变量不同，用来确认只改配置时更新是否正确。测试使用真实的 Service Worker、IndexedDB 和插件产物，覆盖未授权更新、下载失败后的重试、多窗口接管、禁用插件和离线重载。官方市场请求转到本地构建产物，不访问外网；应用仍会校验目录、摘要和插件代码。

CI 把检查、发行版构建和浏览器产物构建并行启动。浏览器产物只构建一次，再分给独立 job。分片按历史耗时分配，基准文件和更新方式在 [`scripts/e2e`](scripts/e2e)。不传 `--shard` 时运行全部用例。

默认只保留失败截图。要看布局参考图时，使用 `CHRONOS_E2E_SCREENSHOTS=1 vp run test:browser`，或对已有产物执行 `CHRONOS_E2E_SCREENSHOTS=1 vpx playwright test`。截图、跟踪和 HTML 报告写在 `dist/e2e`，不要提交。

### 移动端原生检查

Quality 每次运行 Android 的 `:app:testDebugUnitTest` 和 `:app:assembleDebug`。移动端原生或平台源码、依赖、Quality 及发布配置有变化时，还会跑 API 36 仪器测试和 iOS 无签名编译。默认分支和发版运行全部原生检查。只有变更范围明确不需要 iOS 时，完整门禁才接受跳过这项；其他必需 job 仍须成功。

Android 发布构建与 Quality 并行准备 APK。插件历史写入、部署和 Release 发布要等 Quality 通过。更新器的仪器测试和验收范围见 [ADR 0048](.agents/docs/adr/0048-android-native-self-update.md)。

### 提交信息

提交说明使用 `<emoji> <简洁中文>`，不要加 `feat:` 或 `fix:` 前缀。例如：`✨ 新增课表导出功能`。

文档遵循[中文技术文档写作规范](https://github.com/ruanyf/document-style-guide)。ADR 按编号记录决策如何演变，不使用状态标签。后一个方案改变旧结论时，在旧记录里写明适用范围和后续记录，并更新[主题索引](.agents/docs/adr/README.md)。

### 未发布阶段的数据约定

产品尚未发布。Chronos 自有数据库、结构和线格式的版本固定为 `1`，不要新增升级链或旧格式兼容分支。开发数据不兼容时，手动清空对应站点或应用数据，再重新导入。应用不会在启动时自动删除数据。

同源部署按部署根路径区分本地数据，包括 IndexedDB、localStorage、sessionStorage、离线缓存、语言 Cookie 和跨窗口同步。根路径部署使用 `chronos:/:`，`/Chronos` 使用 `chronos:/Chronos:`。命名空间不随应用版本或 Profile 改变。Web 构建可以用 `CHRONOS_BASE_PATH=/Other` 指定其他根路径；Mobile 的根路径保持为空。根路径一旦改变，就会使用另一份数据，原有数据不会自动迁移或删除。

安装记录、插件资源和跨窗口提交的规则见 [ADR 0047](.agents/docs/adr/0047-host-update-transactions.md) 与 [ADR 0051](.agents/docs/adr/0051-atomic-domain-and-plugin-boundaries.md)。

## 架构地图

这里的「宿主」指负责运行和管理插件的主应用。当前 Web 宿主在 `apps/web`。找代码时可以先按职责定位：

| 模块                 | 主要职责                                              | 依赖规则                                                               |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `packages/core`      | 领域模型、排课算法、核心引擎、平台接口和插件扩展接口  | 不访问 DOM 运行时，不依赖 SvelteKit 或某所学校的代码                   |
| `packages/ui-kit`    | Svelte 组件、响应式控制器、表单 Schema 和插件组件容器 | 依赖 `core`                                                            |
| `packages/plugins/*` | 数据源、编解码、工具和主题                            | 可以依赖 `core`、`ui-kit` 和通用库；不能引用宿主内部模块或其他业务插件 |
| `packages/codec-kit` | 字节编解码的基础函数                                  | 作为共享库使用，不作为插件加载                                         |
| `apps/web`           | 页面路由、纯 Web 平台适配、插件安装与主题显示         | 纯 Web 宿主；Vercel 和 Pages 的依赖图不包含 `@capacitor/*`             |
| `apps/mobile`        | 原生容器、移动平台适配器和原生插件集成                | 依赖 Capacitor；移动构建通过配置提供原生平台适配器                     |
| `scripts`            | 插件构建、资源生成和产物校验                          | 具体算法和资源生成由对应插件实现                                       |

`apps/web` 不直接依赖 `@capacitor/*`。移动能力由 `apps/mobile` 在 Mobile 静态 SPA 构建时通过配置和别名接入。插件和业务代码面向 `HostPlatformAdapter` 或 `ChronosEnv` 编写，不要直接导入 Capacitor API。`core` 可以声明 DOM 契约类型，但不能读取 DOM 全局对象，也不能改元素样式。

引擎保存课表等业务状态。`ReactiveChronosController` 把这些状态交给界面。宿主通过 `ChronosEnv` 向引擎提供存储、网络等平台能力；插件通过 `ScopedContext` 使用这些能力。插件停用或卸载时，上下文会清理该插件注册的资源。

公开的引擎状态、课表事件和 UI 快照是只读的领域视图。数据进入引擎时会复制并冻结，读取时不再整份复制。编辑表单使用单独的草稿。新增、修改、删除、按周删除和拖动课程，都通过语义动作提交到最新的已保存课表，而不是把界面上的旧课程列表整份写回。细节见 [ADR 0051](.agents/docs/adr/0051-atomic-domain-and-plugin-boundaries.md)。

### 错误处理

缺少数据、正常的空结果和执行失败要分开表示。存储查询只在记录不存在时返回 `null`。数据库访问、反序列化和映射失败要向上传递，不能用空列表或默认配置代替。核心启动会等本地课表列表和当前课表都读取成功。

输入、认证、网络和格式错误，用已有的业务结果或已知异常表示，到操作边界再转成用户能看懂的提示，并保留原来的 `cause`。内部契约被破坏，以及未知的程序异常，传到页面、插件或启动边界；边界报告失败并停下相关工作。表单校验返回错误文案；校验器自己抛出的异常不是用户输入错误。

插件界面失败时，去掉失败的实例，显示失败状态和重新加载的入口。普通异步任务和事件仍由所属控制器处理，不要假定 Svelte 的渲染边界会接住它们。外观、触觉和缓存可以按各自的约定降级，但不能改变课程数据的含义。

配置和课表状态在写入成功之后才发布。课表已经提交，但后面的刷新或切换失败时，用 `timetable:followUpFailed` 单独报告。删除结果保留这次后续失败的 `cause`，避免把已经完成的操作说成保存或删除失败。清理工作继续释放其他资源，并保留主要错误。完整约定见 [ADR 0050](.agents/docs/adr/0050-error-contracts-and-failure-boundaries.md)。

改了插件渲染边界后，安装 Chromium，再运行 `vpx packages/ui-kit/tests/browser/verify-mountable.ts`，确认真实 Svelte 渲染、失败子树会停止、可以显式重载，以及卸载行为正确。

### 文案

宿主翻译在 `apps/web/messages/{locale}.json`。插件翻译和插件源码放在一起，通常是各包的 `src/messages.ts`。宿主界面用 `hostT`，插件文案用插件提供的 `t` 或 `pluginText`。改文案时同时看 `zh-cn` 和 `en`。

### 构建缓存

官方插件的构建缓存在 `dist/plugin-cache`。资源准备和代码编译分开缓存。日志里的 `resources=hit/built` 和 `compile=hit/built` 表示命中或重新生成。输入变了或缓存损坏时会自动重建。要验证没有缓存的构建，先停掉相关任务，再删这个目录。

开发环境的插件市场由中间件提供，资源写到 `dist/dev-plugins`，不用生产目录 `static/official-plugins`。热更新会跟踪插件源码、共享包、CSS 扫描目录和资源文件。内容没变就不会重新激活插件。构建失败时，继续使用上一次成功的文件。

生产环境给每份资源分配不会改变的修订标识。新资源校验并发布之后，构建才替换市场目录。清理本地产物前，先停掉构建、预览和下载，再清理 `apps/web/static/official-plugins` 并重新构建。

生产构建会合并应用实际打包的依赖，以及所有发行插件的依赖，把许可证清单写到发布目录的 `licenses/third-party.json`。开发环境通过中间件提供同一地址，清单里可能有更多依赖。这个文件由构建生成，不要手改。

## 部署指南

客户端预装哪些插件、服务端启用哪些插件、部署到哪个平台，是三件分开的事。

| 变量                    | 作用                                                                      | 默认值                                                        |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `CHRONOS_DISTRIBUTION`  | 选择 `apps/web/config/distributions.toml` 里的 profile 与 deployment 组合 | 未指定时按 target 选择默认发行项                              |
| `CHRONOS_PROFILE`       | 覆盖发行项里的客户端 profile                                              | 发行项中的 profile                                            |
| `CHRONOS_DEPLOYMENT`    | 覆盖发行项里的服务端 deployment                                           | 发行项中的 deployment                                         |
| `CHRONOS_DEPLOY_TARGET` | 选择部署平台、适配器和 PWA 行为                                           | 未设置时为 Vercel；也可设为 `cloudflare`、`pages` 或 `mobile` |

发行项把 profile 和 deployment 配成一组。deploy target 仍然单独选择：profile 决定客户端预装内容，deployment 决定服务端插件，target 决定平台适配器、SvelteKit 适配器和 PWA 行为。

解析时，target 先决定默认发行项；`CHRONOS_DISTRIBUTION` 或 `--distribution` 再选择发行项；profile 和 deployment 的环境变量可以覆盖发行项里的对应字段；同名的 CLI 参数优先级最高。常用的 `build:*` 任务会自己写明发行项。

需要反复使用的组合时，在 `apps/web/config/distributions.toml` 里加一条：

```toml
[distributions.my-offline]
profile = "chronos-cqut-offline"
deployment = "chronos-default"
```

然后执行 `CHRONOS_DISTRIBUTION=my-offline vp run build`。临时组合可以直接覆盖，例如 `vp run build -- --profile chronos-default --deployment chronos-cqut`，也可以用对应的环境变量。构建会检查所选 profile、deployment 和 target 是否有效、能否一起使用。

| Deploy target | 构建形态                                          | PWA  | 默认 deployment        |
| ------------- | ------------------------------------------------- | ---- | ---------------------- |
| `vercel`      | Vercel Serverless 和静态资源                      | 启用 | `chronos-default`      |
| `cloudflare`  | Cloudflare Pages Functions 和静态资源，根路径为空 | 启用 | `chronos-default`      |
| `pages`       | 静态站点，路径前缀为 `/Chronos`                   | 启用 | `pages`，无服务端插件  |
| `mobile`      | Capacitor 使用的静态 SPA                          | 禁用 | `mobile`，无服务端插件 |

target 的定义在 [deploy-targets.ts](apps/web/src/lib/config/deploy-targets.ts)，profile 和 deployment 的组合在 [distributions.toml](apps/web/config/distributions.toml)。

| 构建任务                                           | 客户端预安装插件                             | 服务端插件    |
| -------------------------------------------------- | -------------------------------------------- | ------------- |
| `build:default`、`build:pages`、`build:cloudflare` | `theme-m3`、`codec-share`                    | 无            |
| `build:cqut-offline`                               | 上述插件和 `source-cqut`，默认使用 HTML 导入 | 无            |
| `build:cqut`                                       | 上述插件和 `source-cqut`，默认使用在线导入   | `source-cqut` |

### Cloudflare Pages

正式的 Web 站点发布到 Cloudflare Pages。`v*` 标签在 Quality 通过后，由 [cloudflare-production.yml](.github/workflows/cloudflare-production.yml) 选择 `cqut` 发行配置，部署到生产分支 `master`。也可以手动运行 [Release CI](.github/workflows/release.yml)，用已有的发行标签部署。

`vp run build:cloudflare` 与 Vercel 一样默认使用 `default` 发行配置。CQUT 在线版加上 `--distribution cqut`。客户端、Functions 和离线资源写到 `apps/web/.svelte-kit/cloudflare`。`vp run preview:cloudflare` 用 Wrangler 的本地 Pages 模式运行。

`vp run deploy:cloudflare` 在 Web 包目录里先构建再上传。`--distribution`、`--profile` 和 `--deployment` 传给 Chronos 构建；`--branch`、`--commit-dirty`、`--commit-hash`、`--commit-message` 等参数传给 Wrangler。例如 `vp run deploy:cloudflare -- --distribution cqut --branch master --commit-dirty=true` 会发布工作区里尚未提交的 CQUT 在线版。任务不写死发行配置、分支或工作区状态；没指定时，分别使用发行配置的默认值和 Wrangler 检测到的 Git 信息。

上传前在 `apps/web` 运行 `vpx wrangler login`。Wrangler 的登录和 `cf` CLI 无关。第一次建项目时使用：

```sh
vpx wrangler pages project create chronos-timetable --production-branch master --compatibility-date 2026-11-12 --force
```

`--force` 用来让新项目走 Direct Upload Pages，避免 Wrangler 转去创建 Workers。项目建好之后直接部署，不必再加 `--force`。

GitHub Actions 使用仓库 secret `CLOUDFLARE_API_TOKEN` 和变量 `CLOUDFLARE_ACCOUNT_ID`。Token 只需要该账户的 Pages Write 权限。生产工作流还会用到七个 `PUBLIC_FIREBASE_*` 仓库变量。这条发布链路不使用 Vercel 的 Token、组织或项目变量。

Cloudflare 上的服务端代码按 `workerd` 条件使用 CQUT 的原生 fetch 会话；Vercel 仍使用 Node 和 undici。`wrangler.jsonc` 配置 Pages 的输出路径和兼容日期。Web 根目录的 `_headers`，以及适配器生成的静态排除规则，让 Service Worker、manifest、更新描述和带版本的离线资源由静态服务返回。新站使用单独的 `cloudflare` 更新身份。首次安装、普通更新和离线启动都要保持可用。

### Vercel

未指定 target 时，`vp run build` 构建 Vercel Serverless 函数和静态资源。生产环境是否启用统计，看 `VERCEL_ENV=production`。新增服务端插件见 [ADR 0044](.agents/docs/adr/0044-server-plugin-definition-and-deployment-assembly.md)。

### GitHub Pages

`vp run build:pages` 的输出目录是 `apps/web/build`，站点路径前缀为 `/Chronos`，没有服务端插件。官方插件的在线目录按宿主版本发布到 GitHub Pages。发布步骤和离线时的行为见 [ADR 0045](.agents/docs/adr/0045-versioned-online-plugin-distribution.md) 与 [ADR 0047](.agents/docs/adr/0047-host-update-transactions.md)。

### Mobile

`vp run mobile:build` 使用 `mobile` target 和 `mobile` 发行项，然后同步 Capacitor 工程。移动端不运行 Web 的服务端处理器。带原生实现的动作通过静态注册表在安装包内执行，Profile 可以禁用其中的动作。

Android 的最低 Chromium WebView 版本是 116。Tailwind 4 要求 111，应用和插件使用的 `AbortSignal.any` 要求 116。版本过低或主页面加载失败时，显示本地的中英文错误页，提示更新系统 WebView 或 Chrome 后再打开。华为 WebView 使用另一套版本号，不能把这个 Chromium 下限当成华为包的版本号。

移动端适配器在 Capacitor 同步前会去掉 Apple touch 图标、PWA 图标、`pwa/` 截图，以及 HTML 里对应的图标引用。Web 和 PWA 构建仍保留这些资源。APK 保留启动图标、插件、许可证和单独的 `webview-error.html`。

Android Release 会做 R8 优化、混淆和资源裁剪，并使用 AGP 8.13 的资源裁剪管线。Capacitor 自带的消费方规则会保留插件和反射入口。新增反射入口时要检查保留规则，并验证优化后的 APK。Web 静态文件仍由 Web 构建处理。Release CI 把各 Profile 的 `mapping.txt` 存成 `android-r8-mapping-*` artifact，保留 90 天。排查崩溃时使用与该 APK 对应的映射；重用已经发布的 APK 不会重新生成映射。长期维护的版本要在 artifact 过期前另行归档。

Release 构建使用已提交的 Baseline Profile 和 Startup Profile，只优化原生启动，不优化 WebView 里的页面代码。重新采集的条件见 [ADR 0049](.agents/docs/adr/0049-bounded-host-startup.md#android-原生启动-profile)。

### 软件更新

Web 更新走 Service Worker。移动端构建关闭 PWA。Web 要等已安装的可选官方插件准备完成，才允许新的 Worker 接管，各个窗口会随接管刷新。Android 检查单独的就绪 feed，包名、签名和 Profile 都匹配后，由原生更新器下载并安装固定的 GitHub APK。下载 APK 之前先准备已安装的可选官方插件，全部校验成功才启动原生任务。新版本启动时直接采用准备好的快照，不会在后台自动补装。约束见 [ADR 0047](.agents/docs/adr/0047-host-update-transactions.md) 和 [ADR 0048](.agents/docs/adr/0048-android-native-self-update.md)。

Web、PWA 和移动端使用同一套自动检查：启动时检查，在线且处于前台时定期检查，回到前台时检查过期结果，网络恢复后立即检查，离线或在后台时暂停。失败后会退避重试，发现更新后停止轮询。自动检查和软件更新页共用状态和进行中的请求。结果出现在「我的 → 关于 → 软件更新」，不自动下载，也不弹窗。检查间隔和退避时间见 [ADR 0048](.agents/docs/adr/0048-android-native-self-update.md)。Android 和 iOS 都不注册、也不监听 Service Worker 更新。

iOS 检查单独的 `/ios/stable.json`。只有 Bundle ID 仍是 `org.uednd.chronos`、并且 Profile 匹配的更新正式版本才会出现。更新页下载并校验钉在 GitHub Release 上的 IPA，再交给用户用当前的自签工具覆盖安装。应用不能代替系统安装。Bundle ID 被改过的安装包会进入阻断状态，不提供下载。教务在线导入要等 iOS 真机上的 Cookie 会话确认之后才启用。最低系统版本是 iOS 17.4。细节见 [ADR 0049：iOS 自签 IPA 更新](.agents/docs/adr/0049-ios-sideload-update.md)。

### 使用统计

Firebase Analytics 的 Web 配置使用 `.env.example` 里的 `PUBLIC_FIREBASE_*`。Android 使用 `apps/mobile/android/app/google-services.json`。某个平台没有这份配置时，构建不会替它打开统计。Cloudflare 的生产构建还要 `CHRONOS_ENABLE_ANALYTICS=true` 才启用。这些是公开的客户端配置，不要把服务账号密钥放进去。

## 插件作者指南

### 定义与生命周期

用 [`defineChronosPlugin`](packages/core/src/plugin/define-chronos-plugin.ts) 声明插件信息、翻译和 `apply(ctx, t)`。可以参考[今日插件](packages/plugins/today/src/index.ts)或[分享插件](packages/plugins/codec-share/src/index.ts)。官方构建会填上与宿主相同的版本号。

插件通过 `ctx` 获取服务、读写自己的配置和键值数据、读取应用状态、调用业务操作，并注册插槽和事件。接口见 [context.ts](packages/core/src/types/context.ts)。`registerSlot` 和 `on` 注册的内容会随上下文清理。其他资源用 `addDisposable` 登记，或在 `dispose` 里释放。

ESM 插件和宿主在同一个进程里，没有安全沙箱。哈希只能说明资源没有损坏，不能说明来源可信。安装前仍要确认插件从哪里来。

### 文案与自定义界面

插件在自己的消息目录里维护翻译。插槽文案要跟着语言切换时，使用 `() => t(key)`。自定义界面使用 `pluginText`。宿主界面使用 `hostT`。见 [ADR 0024](.agents/docs/adr/0024-plugin-message-catalog-i18n.md)。

自定义界面通过 [`ChronosMountable`](packages/core/src/types/mountable.ts) 挂载。`mount` 必须返回带 `unmount` 的对象，也可以提供 `update`。挂载失败时，插件要在抛出错误之前清理已经创建的资源。挂载成功之后，由宿主的组件容器负责卸载。简单输入可以用 `SchemaForm`。

官方 ESM 插件带有自己的 Svelte 运行时，不能用 `getContext()` 读宿主上下文。需要的数据通过 props、controller 或平台接口传入。订阅应用状态可以用 `fromStore(controller.snapshot)`。

课前的「准备上课」时间是宿主偏好 `UserPreferences.prepareReminderMinutes`，默认 30 分钟，只接受 5–60 分钟之间、间隔为 5 分钟的整数。用户在「反馈设置 → 课前提醒」里修改。今日插件和 Android 小组件用的是同一项设置。插件可以读取、修改和监听；非法写入会被拒绝，原来的值保持不变：

```ts
const minutes = ctx.state.userPreferences.prepareReminderMinutes;
await ctx.actions.updatePreferences({ prepareReminderMinutes: 15 });
ctx.on('preferences:updated', ({ preferences }) => {
	refreshStatus(preferences.prepareReminderMinutes);
});
```

`core` 导出 `PREPARE_REMINDER_MINUTES_OPTIONS` 和 `isPrepareReminderMinutes`，可用于选项和校验。今日插件不再保存私有的 `prepareReminderMinutes`，也不迁移那份旧配置。Android 小组件快照的版本仍是 `1`，并且必须带有有效的同名字段。无效快照按不可用处理，等下次宿主同步写成当前结构。

课前提醒默认关闭，跟「今日」插件是否安装无关，只提醒当前课表里这个学期实际会上课的课程。Android 需要通知权限和精确定时权限，由系统记下后续日程，离线、在后台或重启之后仍可提醒。Web 和 PWA 靠页面定时器与 Service Worker 显示通知，依赖 HTTPS、Notifications API 和 Web Locks。页面被挂起或关闭后不保证送达，也没有 Web Push，不会把日程上传出去。权限只在用户操作时申请。回到前台时会再检查权限并重排日程。已经过期的提醒不补发；页面还在运行时，最多允许大约一分钟的延迟，而且课程必须还没开始。

课程颜色通过 `ICoursePresentationService` 获取。颜色按整张课表分配。不要只给当前看得见的课程重新上色，否则同一门课可能在不同页面颜色不同。

### 实际课程安排

要判断某一天有没有课，用 `core` 的 `queryTimetableCoursesForDate(timetable, dateIso)`。要查多天或整学期，用 `queryTimetableCourseOccurrences(timetable, range?)`。范围包含两端；不传范围表示整学期。这两个函数会处理学期边界、周次、星期、已经同步的节假日和可见节次。它们不会把学期以外的日期夹到第一周或最后一周，也不会猜测没有写明的开学日期。课程的具体时刻，以及通知要提前多久，由调用方处理。

`IStorageService.queryCourses` 用来查找已经保存的课程记录，不判断某个日期是否真的有课。宿主提供的服务、状态、操作、事件、插槽和界面接口见[参考：端口契约](#参考端口契约)与[参考：槽位目录](#参考槽位目录)。

### 样式与资源

UI 插件在 `bundle/entry.ts` 里导入 `bundle/styles.css`。样式文件需要引入 `@chronos/ui-kit/theme/plugin-tailwind.css`，并用 `@source` 指向插件自己的源码目录。插件只生成 Tailwind 的工具类，不带 Preflight。宿主不会扫描业务插件的源码。

`text-*`、`ui-*` 等公共样式由宿主提供。颜色和圆角使用公共设计变量，见 [packages/ui-kit/src/theme](packages/ui-kit/src/theme) 和[参考：主题契约](#参考主题契约)。

构建时要生成资源的插件，可以在发行配置里声明 `prepareResources` 模块。模块导出 `prepareResources(outDir)`，返回 `{ colorsJson?, iconsJson? }`，字段填写生成文件的相对路径。常规构建把文件写到生成目录，不改源码。见 [ADR 0043](.agents/docs/adr/0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。

### 导入与导出

导入插件通过 `import.source.tab` 注册入口。`executeImport` 返回 `core` 定义的 `Timetable`。宿主的 `transfer-state` 负责预览、处理确认页上的输入、检查覆盖，最后调用 `engine.importTimetable` 保存。插件可以提供确认页的 Schema 或组件，再用 `finalizePreview` 把确认结果合并进待导入的课表。

导入失败时抛出 `ImportSlotError`。`importKind` 用来选择来源分组的文案。`deepLink.fromLocation` 用来识别链接里的导入参数。分享内容由 `codec-share` 编解码。完整的导入链接由 `IHostLinks` 提供；没有入口地址时，只导出分享口令。

导出插件通过 `export.action` 返回内容，并用 `disposition` 指定复制或下载。剪贴板和下载由宿主处理。格式限制、长度估计和警告文案由编解码插件负责。

### 网络与宿主能力

插件通过平台接口访问网络和存储。使用可选能力之前，先用 `ctx.tryService` 或相应的检测方法确认它可用。

`IHttpService.proxy` 通过 `/api/plugins/{pluginId}/{action}` 调用服务端。调用前用 `supportsPluginServer` 确认当前部署支持这个操作。`bypassCors` 在 Web 宿主上需要构建包含服务端插件代理；移动宿主可以提供自己的网络实现。不要假定每个部署都支持它。

官方插件 Manifest 的 `optionalServerCapabilities` 列出插件可以用的服务端能力。已经声明、但当前部署没有的能力，会在插件列表里提示，安装仍然允许。当前构建只会把已启用的服务端插件写入这个字段，所以没启用的可选能力可能没有提示。插件仍要先调用 `supportsPluginServer`，再注册相关入口。项目还没有通用的网络依赖声明。联网导入可以用 `importKind: 'online'` 标记。其他联网功能要检查请求失败后的表现，并在界面上说明限制或降级结果。

服务端插件从 `./server` 导出请求处理函数，从 `./server/definition` 导出插件 ID、代理 action 和域名。导入定义模块时不要做其他事。宿主要把插件包加进构建依赖，并在部署配置里启用对应的插件 ID。域名用于核对和审查，不会限制服务端向外请求。

宿主代理在单个进程的内存里按插件 ID 和客户端地址限流：15 分钟内最多 8 次。多实例或冷启动不共享这个配额。部署如果需要保护上游的统一配额，应在网关或平台防火墙上配置，不能把本进程的计数当成整个部署的保证。

需要 Android 原生代理的官方插件，还可以导出 `./mobile` 和 `./mobile/definition`。移动端定义应使用相同的插件 ID 和 action，并声明 session 结束时要清理 Cookie 的 HTTPS 来源。handler 通过 `MobilePluginServerContext.createHttpSession()` 取得受限 session，返回 `PluginServerResponse`。插件里不要导入 Capacitor API。构建会校验定义并生成静态注册表。没有原生实现的插件不必添加这些导出。见 [ADR 0046](.agents/docs/adr/0046-mobile-plugin-server-execution.md)。

原生 HTTP session 关闭底层的自动重定向，由宿主逐跳检查 HTTPS 和声明过的域名，最多跟随 20 次，并拒绝循环。显式 `disableRedirects` 会返回原始响应。跨来源跳转会去掉认证和 Cookie 请求头。请求方法和请求体按 HTTP 的跳转语义处理。

打开宿主里的课程详情时，使用可选的 `IHostNavigation.openCourseDetail(courseId, timetableId)`，并传入课程所属的课表 ID。打开课程编辑器使用 `IHostNavigation.openCourseEditor`。获取公开导入链接使用 `IHostLinks.getImportUrl`。不要自己拼接宿主内部路径。

## 新增官方插件与插槽类型

### 新增官方插件

1. 在 `packages/plugins/` 下新建插件包。有业务逻辑或自定义界面的插件使用 ESM。只有静态资源的主题可以只提供 JSON。目录可以参考现有的同类插件。
2. 在 [official-plugins.config.ts](scripts/official-plugins.config.ts) 里登记构建入口和市场展示信息。市场文案独立于插件内部词条，这样安装之前也能显示。
3. 某个发行版需要预装时，把插件 ID 加进对应 Profile。服务端插件还要加入部署配置和宿主的构建依赖。有 Android 原生代理的插件按上一节导出 `./mobile`，不必再登记移动端路由。当前 Profile 要求预装的插件不能禁用或卸载。
4. 运行插件构建或对应的应用构建，检查安装、激活，以及失败后的回滚。可选插件还要检查卸载。有界面的插件还要检查切换语言，以及关闭界面后资源有没有释放。

Bundle、Manifest 和 Catalog 都由构建生成，不要提交到源码分支。开发环境通过中间件提供插件市场。完整的生产市场输出到 `dist/plugin-market/`。宿主的 `apps/web/static/official-plugins/` 只放当前 Profile 必需的插件。在线目录按宿主版本发布到 GitHub Pages，见 [ADR 0047](.agents/docs/adr/0047-host-update-transactions.md) 与 [ADR 0048](.agents/docs/adr/0048-android-native-self-update.md)。

默认主题如何在首屏之前加载、缺少的预装插件如何补上，以及用户配置和离线资源如何处理，见 [ADR 0042](.agents/docs/adr/0042-unified-plugin-preinstallation.md)。

Manifest 里的 `downloadSizeBytes` 只用于显示下载大小，数值是安装所需资源的原始字节数之和。文本按 UTF-8 计算，不包括 Manifest 本身、HTTP 压缩和运行时再请求的内容。没有这个字段就不显示大小。资源是否完整仍由 SHA-256 校验。

### 新增插槽类型

插槽是插件向宿主提供能力的扩展点。插件注册到插槽上的内容称为贡献，例如一个导入入口或课程操作按钮。

现有插槽不够用时，在 [slots.ts](packages/core/src/types/slots.ts) 里定义贡献类型，并把键名加入 `StandardSlotMap`。宿主也要补上对应的处理或渲染。自定义插槽可以用 TypeScript 的模块扩展，加到 `CustomSlotMap`。

设计时要说明：多个插件同时注册时怎么处理，没有内容时界面怎么显示，以及插件卸载后怎么清理。排序使用注册表的结果。文案用 `resolveLocalizedText` 解析。主操作用 `pickPrimary` 选择。组件挂载使用现有的 Mountable 容器。

实现后要验证注册、覆盖、撤销和界面处理是否符合预期。只有出现新的架构选择时，才新增 ADR。

## 参考：端口契约

端口是宿主提供给引擎和插件的平台接口。方法见 [services.ts](packages/core/src/types/services.ts)，宿主传入这些能力的方式见 [env.ts](packages/core/src/types/env.ts)。

| 端口                                        | 职责                                                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `IStorageService`                           | 读写课表、偏好和插件 KV，并查询多个课表中的课程。按日期判断是否有课，使用上一节的课程安排 API。 |
| `IHttpService`                              | 发起请求、调用服务端代理，以及检查服务端能力。                                                  |
| `IHostHttpSessionService`                   | 给原生插件 handler 提供受限来源的 HTTP session，并管理 Cookie 的生命周期。                      |
| `IRuntimeService`                           | 提供平台标识和 SHA-256。                                                                        |
| `IVaultService`                             | 可选的凭据加密存储。Web 端没有实现。                                                            |
| `IAnalyticsService`、`IErrorCaptureService` | 可选的产品统计和错误捕获。                                                                      |
| `IHostNavigation`、`IHostLinks`             | 可选的课程详情、编辑器导航，以及公开导入链接。                                                  |
| `ICoursePresentationService`                | 查询课程调色板，并按课表取得课程颜色。                                                          |

插件 KV 可以存 JSON 或二进制数据。二进制写入 `Blob` 或 `Uint8Array`，读出来统一是 `Blob`。同一个键只能存一种。写入 JSON 会替换原来的二进制数据，反过来也一样。见 [ADR 0036](.agents/docs/adr/0036-plugin-kv-binary-storage.md)。

用户自己的图片和主题图片由宿主放在 `images` 里。插件程序和静态 JSON、CSS 放在 `pluginResources` 里。安装集合和更新准备快照只保存元数据和资源引用。用户配置和业务数据仍在 `pluginData` 与 `pluginBinary` 里。图片要等激活时才进入存储；跨窗口的安装、更新和卸载会按当前修订核对，避免已经卸掉的旧插件又跑起来。见 [ADR 0051](.agents/docs/adr/0051-atomic-domain-and-plugin-boundaries.md)。

## 参考：槽位目录

完整定义见 [slots.ts](packages/core/src/types/slots.ts)。贡献按 `order` 从小到大排列，没写时按 `50` 处理。同一个插槽里，ID 相同的贡献以后注册的为准。`LocalizedText` 可以是字符串、按语言组织的对象，或返回文本的函数。

| 槽位                        | 用途与处理规则                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `import.source.tab`         | 注册多个导入来源。可以使用 Schema 或自定义界面，并共用宿主导入流程。               |
| `export.action`             | 注册多个导出操作，由 `pickPrimary` 选出主操作。                                    |
| `mine.section`、`mine.item` | 注册「我的」页面里的分组和条目。没有指定分组时，宿主使用 `app-support`。           |
| `shell.route.screen`        | 注册 `/plugins/[pluginId]/[id]` 独立页面，也可以用 `landscapeRail` 提供横屏侧栏。  |
| `shell.bottom-bar.tab`      | 注册底部标签。`hostPanel` 表示宿主页面，`defaultLaunch` 表示它可以作为默认启动页。 |
| `timetable.cell.badge`      | 汇总插件提供的课程徽章。没有贡献时直接返回。                                       |
| `course.detail.action`      | 注册课程详情页上的操作。                                                           |
| `theme.definition`          | 注册用户可以选择的配色主题。                                                       |
| `theme.icon.definition`     | 注册图标主题。用哪一套由图标所属的配色主题决定。                                   |

启动时，按排序选择第一个声明了 `defaultLaunch` 的标签。没有声明时选择课表页；还是没有，就选第一项。切换标签只改应用内部状态，不增加路由历史。

## 参考：主题契约

[`ThemeContribution`](packages/core/src/types/contributions.ts) 要提供完整的浅色和深色 Workbench 颜色，也可以提供课程调色板、推荐的图标主题、壁纸 Blob 和取色函数。可用的颜色键见 [workbench-colors.ts](packages/core/src/theme/workbench-colors.ts)，样式用法见 [`packages/ui-kit/src/theme`](packages/ui-kit/src/theme)。

宿主会读取并注册纯 JSON 的主题资源。需要配色算法的主题可以使用 ESM。一个主题如果同时提供 ESM 和颜色 JSON，只有 ESM 会注册配色。宿主会检查插件归属、主题 ID，以及运行时颜色和静态颜色是否一致。

Profile 指定默认主题。构建时根据主题的静态资源生成首屏颜色。M3 算法由 `theme-m3` 实现。

### 壁纸与取色

壁纸来源和配色可以分开选。`wallpaperSource` 可以是 `custom`（自己的图片）、`theme`（主题图片）或 `none`（不要壁纸）。换来源不会删掉用户的图片。

JSON 主题里的壁纸 URL 相对颜色 JSON 的地址解析。图片下载并通过校验后，保存到宿主的图片库。

只有同时满足这几项，才能按壁纸取色：当前用的是 Profile 的默认主题，该主题支持取色，并且壁纸来源是 `custom`。没有图片或取色失败时，保留用户的取色开关，外观回到主题本身的样子。只有这些条件不再成立时才关掉取色。主题暂时没加载时，不清除用户的选择。见 [ADR 0040](.agents/docs/adr/0040-host-wallpaper-and-theme-assets.md) 和 [ADR 0043](.agents/docs/adr/0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。
