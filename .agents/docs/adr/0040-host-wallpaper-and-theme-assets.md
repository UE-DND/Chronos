# ADR 0040：宿主壁纸与主题图片

- 日期：2026-09-20

## 决策与原因

壁纸是宿主的能力，跨主题使用，不再单独分发 `tool-wallpaper`。`/wallpaper` 用来选择来源和外观。`/wallpaper/preview` 用来选图、裁剪和预览。

来源是 `custom`、`theme` 或 `none`，默认是 `theme`。用户的图片和当前来源分开保存。切换主题或来源不会删图片。当前来源没有图片时，不会自动改用另一个来源。确认上传之后，来源变为 `custom`。删除只删用户自己的图片。

## 主题资源与生命周期

主题可以提供一张 `wallpaper?: Blob`。JSON 主题用 `wallpaper: { url, sha256 }` 声明图片，URL 相对颜色 JSON 解析。构建会复制图片并算出哈希。安装时校验、解码，然后存进宿主的 `images` 表。安装记录只保存资源 ID，这样离线也能恢复。

更新失败时留下旧资源，成功之后再清旧图片。禁用主题时资源还在；卸载主题时只删主题自己的资源。Object URL 由宿主管理：用上新的 URI 之后释放旧的，销毁时把剩下的也释放掉。用户自己的图片通过 liveQuery 在多个标签页之间同步，偏好通过 storage 事件同步。

## 后续边界

旧的 `paletteMode`、`supportsDynamicColor`、`DynamicColorAdapter` 和 `dynamicColor:*` 已经去掉。单独的取色开关还在。算法和失败时怎么处理，见 [ADR 0043](0043-theme-owned-color-runtime-and-plugin-host-contracts.md)。壁纸的绘制层继续用 [ADR 0039](0039-shell-wallpaper-compositor.md)。
