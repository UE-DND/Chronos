# ADR 0040: 宿主壁纸与主题图片资源

> 2026-09-20 修订：主题配色算法归属、M3 ESM 分发、首屏资源与壁纸取色以 [ADR 0043](./0043-theme-owned-color-runtime-and-plugin-host-contracts.md) 为准。

- **状态**: Accepted
- **日期**: 2026-09-20
- **关联**: 取代 ADR 0014；修订 ADR 0012、0016、0019、0036；保留 ADR 0039 的外壳合成层

## 决策

自定义壁纸是宿主能力。宿主在 `/wallpaper` 集中管理壁纸来源、配色方案与取色开关，在 `/wallpaper/preview` 提供独立选图、裁剪与预览，官方目录不再分发 `tool-wallpaper`。

`wallpaperSource` 有 `custom`、`theme`、`none` 三种取值，默认 `theme`。自定义图片与模式分开保存；切换主题不改模式，不删除用户图片。来源没有图片时不显示壁纸，不自动切换来源。上传确认后选择 `custom`；删除只删除用户图片。

`wallpaperColorEnabled` 是宿主独立取色模式，默认关闭，在“已安装主题”下方独立栏以开关控制，开启时覆盖所选主题配色。开启时保留 `visualThemeId`，壁纸来源为 `theme` 时继续读取该主题图片；仅默认主题搭配自定义壁纸来源时可启用取色；条件失效自动关闭并恢复主题外观。取色模式使用宿主 M3 基础颜色、课程调色板与默认图标，不依赖 M3 主题插件。没有图片或取色失败时保持基础外观，不更改偏好。详见 [ADR 0041](0041-profile-owned-default-theme.md)。

## 主题资源契约

`ThemeContribution.wallpaper?: Blob` 提供可选图片；宿主管理 Object URL 和绘制，插件不写入宿主壁纸状态。

JSON 主题可以声明 `wallpaper: { url, sha256 }`，相对地址以 colors JSON 为基准。官方构建读取本地图片，复制为 `wallpaper.image`，重写 URL 并计算 SHA-256。安装时下载、校验、解码后才激活，图片存入宿主 `images` 表，安装记录只保存资源 ID；离线启动从本地恢复。

更新失败保留旧资源和旧安装记录；成功后删除旧图片。禁用保留离线资源，卸载删除主题资源，不删除用户自定义图片。ESM 主题可以直接贡献 Blob。当前只支持每个主题一张图片。

## 生命周期

壁纸控制器解析当前来源，订阅 Dexie liveQuery 以接收跨标签页自定义图片变化；偏好沿用宿主 storage 事件同步。新 URI 应用到视图后释放旧 URI，销毁时释放剩余资源。

外观流程先取消旧任务、清理旧动态覆盖，再应用当前主题及宿主取色。过期任务不得绘制或清理新主题。ADR 0039 的常驻图片、模糊预热与冻结范围不变。

## 移除与兼容性

移除壁纸插件、`paletteMode`、`supportsDynamicColor`、插件 `DynamicColorAdapter` 和 `dynamicColor:*` 广播。宿主图片元数据与偏好采用新契约，Dexie 增加 `images` 表。按本次明确要求，不实现旧偏好或图片迁移，不提供旧页面重定向；使用者自行清空旧数据。旧 ESM 插件若消费被移除契约，需要重新适配。
