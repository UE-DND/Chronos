# 插件分发与发布

官方插件与宿主使用同一版本。GitHub Pages 是唯一在线入口，Release 只提供应用安装包。Profile 必需插件随包，可选插件按需下载；外部 Manifest URL 安装入口保留。

## 本地构建

使用 `vp run build:official-plugins` 构建全量市场 `dist/plugin-market/`，同时生成当前 Profile 的内置资源。各发行构建也会完成这一步；宿主构建验证内置资源只包含 Profile 必需插件及其引用资源，不残留前一次 Profile 的文件。

`vp run verify:official-plugins` 校验全量市场的资源摘要、体积和 CSS。构建后的宿主资源校验由构建脚本自动执行，也可使用：

```sh
vp exec node --experimental-strip-types scripts/verify-host-plugins.ts apps/web/build chronos-default
```

开发模式继续通过本地中间件提供全量市场并支持 HMR。正式构建只携带必需插件，预览未发布版本时，其远程可选目录可能尚未存在；需要验证可选插件时使用开发模式，或将构建变量 `CHRONOS_PLUGIN_MARKET_BASE_URL` 指向按同样版本目录组织的 HTTPS 测试站点。该变量配置发行目录根地址，不包含具体版本。

PWA 预缓存必需插件。APK 第一次断网启动仍可补装内置插件；Web PWA 需要先完成首次站点访问和离线资源缓存。安装成功的可选插件从数据库恢复；远程失败时旧插件继续可用，商店提供重试。恢复初始状态会清除安装缓存，再补装必需插件。

## 正式发布

1. 更新应用版本和发布说明，提交后创建 `vX.Y.Z` 标签。迁移首次发布必须使用新版本，不能重新发布旧标签。手动触发 Release CI 同样必须填写正式标签。
2. CI 验证标签指向的提交已合入 `master`，并确认标签版本与 `apps/web/package.json` 一致；随后在该提交运行质量检查和构建。全量市场包含所有官方插件；Pages 网站仍采用 default Profile。
3. CI 将市场快照保存到同仓库 `chronos/plugin-dist` 分支的 `releases/X.Y.Z/`，附带 `release.json` 中的源码提交和文件摘要。该分支只由发布流程写入；不手动修改或强制推送。
4. Pages 部署包含当前网站和全部历史 `plugins/releases/X.Y.Z/`。同版本只允许同提交、同字节重试，冲突必须以新版本发布。部署失败后从同一标签重试即可；保存历史产物成功不等于网站已上线。
5. 上线检查读取当前及一个历史版本的 Catalog、所有 Manifest 和一个资源，并校验摘要。通过后发布 Vercel CQUT 版本。Release CI 为 `chronos-default`、`chronos-cqut`、`chronos-cqut-offline` 分别构建签名 APK，并将三个安装包附加到对应 GitHub Release。首次发布前需配置 `ANDROID_KEYSTORE_BASE64`、`ANDROID_KEYSTORE_PASSWORD`、`ANDROID_KEY_ALIAS`、`ANDROID_KEY_PASSWORD` 四个 Actions Secrets，并安全备份 keystore。

工作流仅在更新产物分支的 job 使用 `contents: write`，Pages 发布使用 `pages: write` 和 `id-token: write`。仓库必须允许 GitHub Actions 更新产物分支；分支规则如有保护，需要为发布流程配置写入权限。依赖版本、官方目录及产物构建规则来自标签提交。

## 回滚与限制

手动选择一个迁移后的已发布标签可重新部署网站；所有历史插件目录继续保留。回滚到迁移前的工作流不受此保留规则保护，不要用旧流程覆盖 Pages。需要恢复历史插件部署时使用迁移后的发布流程，而不是重新构建旧标签。

Pages 不可达时不能安装新可选插件，不自动切换到 Release 或 Vercel。正式上线前需从浏览器、Android WebView 和目标用户网络检查可达性、CORS 与 Blob ESM 加载。CI 的 HTTP 检查不替代跨域验收。原生插件及平台能力仍需随 APK 更新。

目录、数据库和线格式版本仍为 `1`，不做开发数据自动迁移或自动删除；地址变更后有旧开发数据时手动清空并重新导入。决策依据见 [ADR 0045](../.agents/docs/adr/0045-versioned-online-plugin-distribution.md)。
